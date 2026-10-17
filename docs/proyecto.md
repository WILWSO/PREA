# PREA — Pastores Reformados en Argentina

## Propósito

Crear el sitio institucional de PREA para fomentar la fe reformada en Argentina, vincular pastores e iglesias reformadas, promover la comunión y respaldar la confesionalidad reformada en todo el país.

PREA es interdenominacional y confesional. Su marco incluye la Confesión de Fe de Westminster y sus catecismos, las Tres Formas de Unidad y la Confesión Bautista de Fe de Londres de 1689. La definición de reformado incluye a los reformados aliancistas/pactualistas de Argentina.

## Alcance del MVP

### Sitio público

- Presentación de PREA, su identidad y el proceso de vinculación.
- Agenda pública de eventos.
- Directorio público de pastores vinculados.
- Formulario doctrinal multi-step para solicitar vinculación pastoral.
- Diseño mobile-first y navegación accesible.

### Panel privado

- Acceso mediante usuario institucional autenticado.
- Usuarios con rol `admin` o `editor` pueden consultar y administrar solicitudes, eventos y directorio.
- Las cuentas y sus roles se administran en Supabase Auth y `public.user_roles`; el MVP no incluye una pantalla para administrar usuarios.
- Solicitudes con estados: Pendiente, En revisión, Aprobada y Rechazada. Las decisiones del Consejo se tomarán en reunión y culminarán en un acta; los criterios y el procedimiento institucional se definirán en esa instancia.
- Crear, editar y publicar eventos.
- Crear, editar y publicar perfiles del directorio.

### Solicitud pastoral y privacidad

- El formulario se basa en las secciones 1 y 4 de `assets/PREA_Formulario_Editable.html`: identificación del pastor y declaración de posiciones doctrinales. Se presenta por pasos temáticos.
- Incluye localidad/ciudad y provincia para poder preparar el perfil público, además de los campos de identificación y las respuestas doctrinales.
- Todos los campos enviados se guardan en Supabase. Los datos completos de la solicitud son privados y solo están disponibles para usuarios autenticados con rol PREA.
- Al recibir una solicitud, Resend envía una confirmación al solicitante y una notificación al equipo.
- La aprobación de una solicitud no publica automáticamente un perfil. El equipo debe crear y publicar por separado una entrada en el directorio.
- El directorio público solo expone nombre y apellido, institución/iglesia, localidad/ciudad y provincia.

### Fuera del MVP

- Galería de fotos.
- Integración, carrusel o publicaciones de Instagram. Por ahora, el sitio no incrusta ni almacena contenido de redes sociales.

## Gestión de contenidos

Usuarios `admin` y `editor` pueden administrar agenda, directorio y solicitudes desde el panel privado. Los eventos y perfiles no publicados quedan ocultos para visitantes.

## Tecnología y operación

- Aplicación: SvelteKit con TypeScript.
- Alojamiento: Vercel con el adaptador oficial de SvelteKit.
- Base de datos y autenticación: Supabase.
- Correo transaccional: Resend.
- Dominio: `www.prea.ar`, registrado/administrado en Donweb; su DNS se configurará desde Vercel según los registros que indique el proyecto.
- El `SUPABASE_SERVICE_ROLE_KEY` se utiliza solo en el servidor y nunca debe exponerse al navegador ni subirse al repositorio.
- El archivo `.env.example` enumera las variables necesarias para la ejecución local y el despliegue.

## Referencias de marca y formulario

- Logo institucional: `assets/logo.jpeg`. Se permiten adaptaciones de formato/tamaño que conserven el diseño esencial.
- El formulario de referencia contiene también información académica y de evaluación de cursos, que no forma parte de la solicitud pastoral del MVP.
- Los criterios de aceptación detallados se definirán en reunión del Consejo.

## Puesta en marcha

1. Crear el proyecto de Supabase y aplicar la migración de `supabase/migrations`.
2. Crear las cuentas institucionales con Supabase Auth y asignarles un rol en `public.user_roles`.
3. Completar las variables locales de `.env.example` en `.env`, y las variables correspondientes en Vercel.
4. Configurar y verificar el dominio en Vercel y en el panel DNS de Donweb.
5. Instalar dependencias con `npm install`; iniciar con `npm run dev`.
