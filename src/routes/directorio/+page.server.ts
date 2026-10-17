import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase) return { pastors: [] };
	const { data, error: queryError } = await locals.supabase
		.from('pastors')
		.select('id, full_name, institution, city, province')
		.eq('is_published', true)
		.order('full_name');

	if (queryError) throw error(500, 'No se pudo cargar el directorio pastoral.');
	return { pastors: data ?? [] };
};
