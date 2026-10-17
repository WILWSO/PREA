import { createClient } from '@supabase/supabase-js';
import { fail, type Actions } from '@sveltejs/kit';
import { Resend } from 'resend';
import { applicationFieldNames, doctrinalFields } from '../../lib/application-fields';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const actions: Actions = {
	submit: async ({ request }) => {
		const formData = await request.formData();
		if (String(formData.get('website') ?? '').trim()) {
			return fail(400, {
				error: 'No se pudo validar el envío. Revisá el formulario e intentá nuevamente.'
			});
		}

		const fields = Object.fromEntries(
			applicationFieldNames.map((name) => [name, String(formData.get(name) ?? '').trim()])
		);

		const missing = applicationFieldNames.filter((name) => !fields[name]);
		if (missing.length)
			return fail(400, { error: 'Completá todos los campos para enviar la solicitud.' });
		if (!emailPattern.test(fields.email)) {
			return fail(400, { error: 'Ingresá una dirección de correo electrónico válida.' });
		}
		if (applicationFieldNames.some((name) => fields[name].length > 5000)) {
			return fail(400, { error: 'Uno o más campos superan el largo permitido.' });
		}
		if (formData.get('privacy_consent') !== 'on') {
			return fail(400, {
				error: 'Para enviar la solicitud, confirmá que leíste el aviso de privacidad.'
			});
		}

		if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
			return fail(503, {
				error: 'El formulario todavía no está conectado. Intentá nuevamente más tarde.'
			});
		}

		const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
			auth: { autoRefreshToken: false, persistSession: false }
		});
		const doctrine = Object.fromEntries(doctrinalFields.map(({ name }) => [name, fields[name]]));
		const { error: insertError } = await admin.from('applications').insert({
			full_name: fields.full_name,
			church: fields.church,
			denomination: fields.denomination,
			theological_education: fields.theological_education,
			institution_studied: fields.institution_studied,
			phone: fields.phone,
			email: fields.email,
			ministry_institution: fields.ministry_institution,
			confession: fields.confession,
			city: fields.city,
			province: fields.province,
			doctrine,
			privacy_consent: true
		});

		if (insertError) {
			console.error('No se pudo guardar una solicitud de vinculación:', insertError.message);
			return fail(500, { error: 'No se pudo guardar la solicitud. Intentá nuevamente más tarde.' });
		}

		let emailWarning = false;
		if (
			process.env.RESEND_API_KEY &&
			process.env.RESEND_FROM_EMAIL &&
			process.env.PREA_ADMIN_EMAIL
		) {
			const resend = new Resend(process.env.RESEND_API_KEY);
			const emailResults = await Promise.allSettled([
				resend.emails.send({
					from: process.env.RESEND_FROM_EMAIL,
					to: fields.email,
					subject: 'Recibimos tu solicitud de vinculación con PREA',
					text: `Hola ${fields.full_name}:\n\nRecibimos tu solicitud de vinculación con Pastores Reformados en Argentina. El Consejo de PREA la revisará y se pondrá en contacto cuando haya una resolución.\n\nEste correo confirma la recepción, no la aprobación de la solicitud.\n\nPREA · Pastores Reformados en Argentina`
				}),
				resend.emails.send({
					from: process.env.RESEND_FROM_EMAIL,
					to: process.env.PREA_ADMIN_EMAIL,
					subject: 'Nueva solicitud de vinculación pastoral',
					text: `Se recibió una nueva solicitud de ${fields.full_name} (${fields.email}), de ${fields.church}, ${fields.city}, ${fields.province}.\n\nIngresá al panel institucional de PREA para revisar la información.`
				})
			]);
			const failedEmailResults = emailResults.filter(
				(result) => result.status === 'rejected' || result.value.error
			);
			if (failedEmailResults.length) {
				emailWarning = true;
				console.error(
					'La solicitud quedó guardada, pero falló uno o más avisos por Resend:',
					failedEmailResults.map((result) =>
						result.status === 'rejected'
							? result.reason instanceof Error
								? result.reason.message
								: 'Error de transporte'
							: result.value.error?.message
					)
				);
			}
		} else {
			emailWarning = true;
			console.error(
				'Solicitud guardada, pero faltan variables de entorno para enviar avisos con Resend.'
			);
		}

		return { success: true, emailWarning };
	}
};
