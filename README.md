# PREA

Sitio institucional de Pastores Reformados en Argentina, construido con SvelteKit, Supabase y Resend.

## Requisitos

- Node.js 22 o superior.
- Proyecto de Supabase con Auth habilitado.
- Cuenta de Resend para el envío de correos.

## Desarrollo local

1. Instalar dependencias:

   ```sh
   npm install
   ```

2. Copiar `.env.example` a `.env` y completar:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo servidor)
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `PREA_ADMIN_EMAIL`

3. Aplicar `supabase/migrations/20261014000000_initial_schema.sql` en el proyecto Supabase.
4. Crear los usuarios institucionales en Supabase Auth. Asignar roles en el editor SQL de Supabase, por ejemplo:

   ```sql
   insert into public.user_roles (user_id, role)
   values ('UUID_DEL_USUARIO', 'admin');
   ```

   Los roles admitidos son `admin` y `editor`. Las cuentas no se registran desde el sitio público.

5. Iniciar el servidor local:

   ```sh
   npm run dev
   ```

## Comprobaciones

```sh
npm run check
npm run lint
npm run build
```

## Paletas de colores

Todos los colores del sitio salen de variables CSS (`--color-*`) definidas en `src/lib/themes/`. Cada archivo es una paleta:

- `glaciar.css`: **paleta activa**. Marino, Azul, Celeste, Hielo y Nieve, con variante clara y oscura.
- `original.css`: azul institucional y dorado (también es la base de respaldo).
- `lluvia.css`: Dew, Rain, Currant, Slate y Creosote.
- `crepusculo.css`: Índigo, Lavanda, Arena, Vino y Berenjena.

**Cambiar la paleta del sitio:** editar `activeTheme` en `src/lib/theme.ts` (por ejemplo `'original'` para volver atrás).

**Previsualizar sin tocar código:** abrir cualquier página con `?tema=<nombre>` (por ejemplo `?tema=lluvia`). La elección queda guardada en tu navegador; `?tema=reset` vuelve a la paleta activa.

**Agregar una paleta nueva:**

1. Copiar `src/lib/themes/lluvia.css` con otro nombre (por ejemplo `bosque.css`), cambiar el selector a `:root[data-theme='bosque']` y ajustar los colores.
2. Importarla en `src/lib/themes/index.css`.
3. Agregar `'bosque'` a la lista `themes` en `src/lib/theme.ts`.

### Modos claro, oscuro y automático

El encabezado tiene un selector con tres modos: **Automático** (sigue la configuración del dispositivo), **Claro** y **Oscuro**. La elección se guarda en la cookie `prea_modo`, así la página carga directamente en el modo correcto.

Para que una paleta tenga modo oscuro, agregar en su archivo un bloque `:root[data-theme='<nombre>'][data-scheme='dark']` con los colores oscuros (ver el final de `glaciar.css`). Las paletas sin ese bloque se ven siempre en su versión clara.

## Configuración de despliegue

Desplegar el proyecto en Vercel y configurar allí las variables de entorno. Agregar `www.prea.ar` al proyecto de Vercel y configurar en Donweb los registros DNS que Vercel indique. No publicar nunca la clave de servicio de Supabase.
