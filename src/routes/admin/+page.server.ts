import { error, fail, redirect, type Actions, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

async function requireEditor(event: RequestEvent) {
	const supabase = event.locals.supabase;
	if (!supabase) throw error(503, 'El acceso institucional todavía no está configurado.');
	if (!event.locals.user) throw redirect(303, '/admin');

	const { data, error: roleError } = await supabase
		.from('user_roles')
		.select('role')
		.eq('user_id', event.locals.user.id)
		.maybeSingle();
	if (roleError) throw error(500, 'No se pudo comprobar el permiso institucional.');
	if (!data) throw error(403, 'Tu usuario no está autorizado para acceder al panel de PREA.');
	return { supabase, role: data.role as 'admin' | 'editor' };
}

function eventValues(formData: FormData) {
	const title = String(formData.get('title') ?? '').trim();
	const description = String(formData.get('description') ?? '').trim();
	const location = String(formData.get('location') ?? '').trim();
	const date = String(formData.get('starts_at') ?? '').trim();
	const registrationUrl = String(formData.get('registration_url') ?? '').trim();
	const startsAt = date ? new Date(`${date}:00-03:00`) : null;

	if (!title || !date || !startsAt || Number.isNaN(startsAt.valueOf())) {
		return { error: 'Ingresá el título y una fecha válida para el evento.' } as const;
	}
	if (title.length > 180 || description.length > 5000 || location.length > 180) {
		return { error: 'Revisá el largo de los campos del evento.' } as const;
	}
	if (registrationUrl) {
		try {
			if (new URL(registrationUrl).protocol !== 'https:') throw new Error('invalid protocol');
		} catch {
			return { error: 'El enlace de inscripción debe ser una URL HTTPS válida.' } as const;
		}
	}

	return {
		values: {
			title,
			description,
			location,
			starts_at: startsAt.toISOString(),
			registration_url: registrationUrl || null,
			is_published: formData.get('is_published') === 'on',
			updated_at: new Date().toISOString()
		}
	} as const;
}

function pastorValues(formData: FormData) {
	const values = {
		full_name: String(formData.get('full_name') ?? '').trim(),
		institution: String(formData.get('institution') ?? '').trim(),
		city: String(formData.get('city') ?? '').trim(),
		province: String(formData.get('province') ?? '').trim(),
		is_published: formData.get('is_published') === 'on',
		updated_at: new Date().toISOString()
	};
	if (Object.values(values).some((value) => typeof value === 'string' && !value)) {
		return { error: 'Completá nombre, institución, localidad y provincia.' } as const;
	}
	if (
		values.full_name.length > 180 ||
		values.institution.length > 180 ||
		values.city.length > 120 ||
		values.province.length > 120
	) {
		return { error: 'Uno o más campos del perfil son demasiado extensos.' } as const;
	}
	return { values } as const;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase)
		return { configured: false, user: null, role: null, applications: [], events: [], pastors: [] };
	if (!locals.user)
		return { configured: true, user: null, role: null, applications: [], events: [], pastors: [] };

	const { data: roleData, error: roleError } = await locals.supabase
		.from('user_roles')
		.select('role')
		.eq('user_id', locals.user.id)
		.maybeSingle();
	if (roleError) throw error(500, 'No se pudo comprobar el permiso institucional.');
	if (!roleData) throw error(403, 'Tu usuario no está autorizado para acceder al panel de PREA.');

	const [applicationsResult, eventsResult, pastorsResult] = await Promise.all([
		locals.supabase.from('applications').select('*').order('created_at', { ascending: false }),
		locals.supabase.from('events').select('*').order('starts_at'),
		locals.supabase.from('pastors').select('*').order('full_name')
	]);
	if (applicationsResult.error) throw error(500, 'No se pudieron cargar las solicitudes.');
	if (eventsResult.error) throw error(500, 'No se pudieron cargar los eventos.');
	if (pastorsResult.error) throw error(500, 'No se pudo cargar el directorio.');

	return {
		configured: true,
		user: locals.user.email ?? 'Usuario PREA',
		role: roleData.role as 'admin' | 'editor',
		applications: applicationsResult.data ?? [],
		events: eventsResult.data ?? [],
		pastors: pastorsResult.data ?? []
	};
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		if (!locals.supabase)
			return fail(503, { error: 'El acceso institucional todavía no está configurado.' });
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');
		if (!email || !password) return fail(400, { error: 'Ingresá tu correo y contraseña.' });

		const { error: loginError } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});
		if (loginError)
			return fail(400, { error: 'No se pudo iniciar sesión. Revisá tus credenciales.' });
		throw redirect(303, '/admin');
	},
	logout: async ({ locals }) => {
		if (!locals.supabase) throw error(503, 'El acceso institucional no está configurado.');
		const { error: logoutError } = await locals.supabase.auth.signOut();
		if (logoutError) throw error(500, 'No se pudo cerrar la sesión.');
		throw redirect(303, '/admin');
	},
	updateApplication: async (event) => {
		const { supabase } = await requireEditor(event);
		const formData = await event.request.formData();
		const id = String(formData.get('id') ?? '');
		const status = String(formData.get('status') ?? '');
		if (!id || !['pendiente', 'en_revision', 'aprobada', 'rechazada'].includes(status)) {
			return fail(400, { error: 'El estado indicado no es válido.' });
		}
		const { error: updateError } = await supabase
			.from('applications')
			.update({ status, updated_at: new Date().toISOString() })
			.eq('id', id);
		if (updateError) {
			console.error('No se pudo actualizar el estado de una solicitud:', updateError.message);
			return fail(500, { error: 'No se pudo actualizar la solicitud.' });
		}
		return { message: 'Estado de solicitud actualizado.' };
	},
	createEvent: async (event) => {
		const { supabase } = await requireEditor(event);
		const result = eventValues(await event.request.formData());
		if ('error' in result) return fail(400, { error: result.error });
		const { error: insertError } = await supabase.from('events').insert(result.values);
		if (insertError) {
			console.error('No se pudo crear un evento:', insertError.message);
			return fail(500, { error: 'No se pudo guardar el evento.' });
		}
		return { message: 'Evento creado.' };
	},
	updateEvent: async (event) => {
		const { supabase } = await requireEditor(event);
		const formData = await event.request.formData();
		const id = String(formData.get('id') ?? '');
		const result = eventValues(formData);
		if (!id) return fail(400, { error: 'No se indicó el evento que se quiere editar.' });
		if ('error' in result) return fail(400, { error: result.error });
		const { error: updateError } = await supabase.from('events').update(result.values).eq('id', id);
		if (updateError) {
			console.error('No se pudo actualizar un evento:', updateError.message);
			return fail(500, { error: 'No se pudo actualizar el evento.' });
		}
		return { message: 'Evento actualizado.' };
	},
	createPastor: async (event) => {
		const { supabase } = await requireEditor(event);
		const result = pastorValues(await event.request.formData());
		if ('error' in result) return fail(400, { error: result.error });
		const { error: insertError } = await supabase.from('pastors').insert(result.values);
		if (insertError) {
			console.error('No se pudo crear un perfil del directorio:', insertError.message);
			return fail(500, { error: 'No se pudo guardar el perfil.' });
		}
		return { message: 'Perfil pastoral creado.' };
	},
	updatePastor: async (event) => {
		const { supabase } = await requireEditor(event);
		const formData = await event.request.formData();
		const id = String(formData.get('id') ?? '');
		const result = pastorValues(formData);
		if (!id) return fail(400, { error: 'No se indicó el perfil que se quiere editar.' });
		if ('error' in result) return fail(400, { error: result.error });
		const { error: updateError } = await supabase
			.from('pastors')
			.update(result.values)
			.eq('id', id);
		if (updateError) {
			console.error('No se pudo actualizar un perfil del directorio:', updateError.message);
			return fail(500, { error: 'No se pudo actualizar el perfil.' });
		}
		return { message: 'Perfil pastoral actualizado.' };
	}
};
