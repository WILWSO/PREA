import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit/hooks';
import {
	activeTheme,
	colorModeCookie,
	isColorMode,
	isThemeName,
	themePreviewCookie,
	type ThemeName
} from './lib/theme';

// ?tema=<nombre> guarda una vista previa en una cookie; ?tema=reset vuelve a la paleta activa.
function resolveTheme(event: Parameters<Handle>[0]['event']): ThemeName {
	const requested = event.url.searchParams.get('tema');

	if (requested === 'reset') {
		event.cookies.delete(themePreviewCookie, { path: '/' });
		return activeTheme;
	}

	if (isThemeName(requested)) {
		event.cookies.set(themePreviewCookie, requested, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: event.url.protocol === 'https:',
			maxAge: 60 * 60 * 24 * 30
		});
		return requested;
	}

	const saved = event.cookies.get(themePreviewCookie);
	return isThemeName(saved) ? saved : activeTheme;
}

export const handle: Handle = async ({ event, resolve }) => {
	const theme = resolveTheme(event);
	const savedMode = event.cookies.get(colorModeCookie);
	const mode = isColorMode(savedMode) ? savedMode : 'auto';
	// En "auto" el script de app.html corrige el esquema según el dispositivo antes de pintar.
	const scheme = mode === 'dark' ? 'dark' : 'light';
	event.locals.colorMode = mode;
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_ANON_KEY;

	event.locals.supabase = null;
	event.locals.user = null;

	if (url && key) {
		const supabase = createServerClient(url, key, {
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookies) => {
					cookies.forEach(({ name, value, options }) => event.cookies.set(name, value, options));
				}
			}
		});

		event.locals.supabase = supabase;
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		if (error) {
			console.error('No se pudo validar la sesión de Supabase:', error.message);
		} else {
			event.locals.user = user;
		}
	}

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('%prea.theme%', theme)
				.replace('%prea.mode%', mode)
				.replace('%prea.scheme%', scheme)
	});
};
