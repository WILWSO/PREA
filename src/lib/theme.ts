// Cada nombre debe tener su archivo en src/lib/themes/ importado en themes/index.css.
export const themes = ['original', 'lluvia', 'crepusculo', 'glaciar'] as const;

export type ThemeName = (typeof themes)[number];

// Único punto de cambio: la paleta que ve todo el sitio.
export const activeTheme: ThemeName = 'glaciar';

export const themePreviewCookie = 'prea_tema';

export function isThemeName(value: string | null | undefined): value is ThemeName {
	return themes.includes(value as ThemeName);
}

// Modo de color elegido por el visitante. "auto" sigue la configuración del dispositivo.
export const colorModes = ['auto', 'light', 'dark'] as const;

export type ColorMode = (typeof colorModes)[number];

export const colorModeCookie = 'prea_modo';

export function isColorMode(value: string | null | undefined): value is ColorMode {
	return colorModes.includes(value as ColorMode);
}
