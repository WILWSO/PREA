import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase) return { events: [] };
	const { data, error: queryError } = await locals.supabase
		.from('events')
		.select('id, title, description, location, starts_at, registration_url')
		.eq('is_published', true)
		.gte('starts_at', new Date().toISOString())
		.order('starts_at');

	if (queryError) throw error(500, 'No se pudo cargar la agenda.');
	return { events: data ?? [] };
};
