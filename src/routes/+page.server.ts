import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase) return { events: [], pastors: [] };

	const [{ data: events, error: eventsError }, { data: pastors, error: pastorsError }] =
		await Promise.all([
			locals.supabase
				.from('events')
				.select('id, title, description, location, starts_at, registration_url')
				.eq('is_published', true)
				.gte('starts_at', new Date().toISOString())
				.order('starts_at')
				.limit(3),
			locals.supabase
				.from('pastors')
				.select('id, full_name, institution, city, province')
				.eq('is_published', true)
				.order('full_name')
				.limit(6)
		]);

	if (eventsError) throw error(500, 'No se pudieron cargar los eventos.');
	if (pastorsError) throw error(500, 'No se pudo cargar el directorio pastoral.');

	return { events: events ?? [], pastors: pastors ?? [] };
};
