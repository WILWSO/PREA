<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const dateFormat = new Intl.DateTimeFormat('es-AR', {
		dateStyle: 'long',
		timeStyle: 'short',
		timeZone: 'America/Argentina/Buenos_Aires'
	});

	function localDateValue(value: string) {
		const date = new Date(value);
		const parts = new Intl.DateTimeFormat('en-CA', {
			timeZone: 'America/Argentina/Buenos_Aires',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hourCycle: 'h23'
		}).formatToParts(date);
		const part = (type: string) => parts.find((item) => item.type === type)?.value ?? '';
		return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`;
	}
</script>

<svelte:head>
	<title>Administración institucional | PREA</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="admin-wrap">
	{#if !data.configured}
		<div class="login-card">
			<p class="eyebrow">Acceso institucional</p>
			<h1>Panel de PREA</h1>
			<p class="form-intro">
				El acceso requiere configurar Supabase en las variables de entorno del proyecto.
			</p>
			<a href={resolve('/')}>Volver al sitio</a>
		</div>
	{:else if !data.user}
		<form class="login-card admin-stack" method="POST" action="?/login">
			<p class="eyebrow">Acceso institucional</p>
			<h1>Panel de PREA</h1>
			<p class="form-intro">Ingresá con el usuario institucional autorizado.</p>
			{#if form?.error}<p class="alert" role="alert">{form.error}</p>{/if}
			<label class="form-field">
				<span>Correo electrónico</span>
				<input name="email" type="email" autocomplete="username" required />
			</label>
			<label class="form-field">
				<span>Contraseña</span>
				<input name="password" type="password" autocomplete="current-password" required />
			</label>
			<button class="solid-button" type="submit">Ingresar</button>
			<a href={resolve('/')}>Volver al sitio</a>
		</form>
	{:else}
		<div class="admin-title">
			<div>
				<p class="eyebrow">Gestión institucional · {data.role}</p>
				<h1>Panel de PREA</h1>
				<p class="form-intro">Sesión iniciada como {data.user}</p>
			</div>
			<form method="POST" action="?/logout">
				<button class="plain-button">Cerrar sesión</button>
			</form>
		</div>
		{#if form?.error}<p class="alert" role="alert">{form.error}</p>{/if}
		{#if form?.message}<p class="alert success" role="status">{form.message}</p>{/if}
		<nav class="admin-tabs" aria-label="Secciones del panel">
			<a href="#solicitudes">Solicitudes ({data.applications.length})</a>
			<a href="#eventos">Agenda ({data.events.length})</a>
			<a href="#directorio">Directorio ({data.pastors.length})</a>
		</nav>

		<section id="solicitudes" class="admin-panel">
			<h2>Solicitudes de vinculación</h2>
			{#if data.applications.length}
				<div class="admin-stack">
					{#each data.applications as application (application.id)}
						<details class="admin-item">
							<summary>
								<span>{application.full_name} · {application.church}</span>
								<span>{application.status.replace('_', ' ')}</span>
							</summary>
							<p>
								{application.email} · {application.phone} · {application.city}, {application.province}
							</p>
							<dl>
								<dt>Denominación</dt>
								<dd>{application.denomination}</dd>
								<dt>Formación teológica</dt>
								<dd>{application.theological_education}</dd>
								<dt>Institución donde estudió</dt>
								<dd>{application.institution_studied}</dd>
								<dt>Institución que representa o dirige</dt>
								<dd>{application.ministry_institution}</dd>
								<dt>Confesión de fe</dt>
								<dd>{application.confession}</dd>
								{#each Object.entries(application.doctrine ?? {}) as [topic, answer] (topic)}
									<dt>{topic.replaceAll('_', ' ')}</dt>
									<dd>{answer}</dd>
								{/each}
							</dl>
							<p>Recibida: {dateFormat.format(new Date(application.created_at))}</p>
							<form class="admin-inline" method="POST" action="?/updateApplication">
								<input type="hidden" name="id" value={application.id} />
								<label>
									<span class="sr-only">Estado de solicitud</span>
									<select class="status-select" name="status" value={application.status}>
										<option value="pendiente">Pendiente</option>
										<option value="en_revision">En revisión</option>
										<option value="aprobada">Aprobada</option>
										<option value="rechazada">Rechazada</option>
									</select>
								</label>
								<button class="solid-button" type="submit">Guardar estado</button>
							</form>
						</details>
					{/each}
				</div>
			{:else}
				<p class="empty-note">Todavía no hay solicitudes recibidas.</p>
			{/if}
		</section>

		<section id="eventos" class="admin-panel admin-subsection">
			<h2>Agenda de eventos</h2>
			<form class="admin-grid" method="POST" action="?/createEvent">
				<label class="form-field"
					><span>Título *</span><input name="title" maxlength="180" required /></label
				>
				<label class="form-field"
					><span>Fecha y hora (Argentina) *</span><input
						name="starts_at"
						type="datetime-local"
						required
					/></label
				>
				<label class="form-field"><span>Lugar</span><input name="location" maxlength="180" /></label
				>
				<label class="form-field"
					><span>Enlace de inscripción (HTTPS)</span><input
						name="registration_url"
						type="url"
					/></label
				>
				<label class="form-field wide"
					><span>Descripción</span><textarea name="description" maxlength="5000"></textarea></label
				>
				<label class="admin-check wide"
					><input name="is_published" type="checkbox" /> Publicar inmediatamente</label
				>
				<button class="solid-button wide" type="submit">Crear evento</button>
			</form>
			{#each data.events as event (event.id)}
				<details class="admin-item">
					<summary
						><span>{event.title}</span><span>{event.is_published ? 'Publicado' : 'Borrador'}</span
						></summary
					>
					<form class="admin-grid" method="POST" action="?/updateEvent">
						<input type="hidden" name="id" value={event.id} />
						<label class="form-field"
							><span>Título *</span><input
								name="title"
								value={event.title}
								maxlength="180"
								required
							/></label
						>
						<label class="form-field"
							><span>Fecha y hora (Argentina) *</span><input
								name="starts_at"
								type="datetime-local"
								value={localDateValue(event.starts_at)}
								required
							/></label
						>
						<label class="form-field"
							><span>Lugar</span><input
								name="location"
								value={event.location}
								maxlength="180"
							/></label
						>
						<label class="form-field"
							><span>Enlace de inscripción (HTTPS)</span><input
								name="registration_url"
								type="url"
								value={event.registration_url ?? ''}
							/></label
						>
						<label class="form-field wide"
							><span>Descripción</span><textarea name="description" maxlength="5000"
								>{event.description}</textarea
							></label
						>
						<label class="admin-check wide"
							><input name="is_published" type="checkbox" checked={event.is_published} /> Publicado</label
						>
						<button class="solid-button wide" type="submit">Guardar cambios</button>
					</form>
				</details>
			{/each}
		</section>

		<section id="directorio" class="admin-panel admin-subsection">
			<h2>Directorio de pastores</h2>
			<p class="form-intro">
				Solo se publican nombre, institución, localidad y provincia. La información privada de la
				solicitud no se comparte aquí.
			</p>
			<form class="admin-grid" method="POST" action="?/createPastor">
				<label class="form-field"
					><span>Nombre y apellido *</span><input
						name="full_name"
						maxlength="180"
						required
					/></label
				>
				<label class="form-field"
					><span>Institución o iglesia *</span><input
						name="institution"
						maxlength="180"
						required
					/></label
				>
				<label class="form-field"
					><span>Localidad o ciudad *</span><input name="city" maxlength="120" required /></label
				>
				<label class="form-field"
					><span>Provincia *</span><input name="province" maxlength="120" required /></label
				>
				<label class="admin-check wide"
					><input name="is_published" type="checkbox" /> Publicar perfil</label
				>
				<button class="solid-button wide" type="submit">Agregar al directorio</button>
			</form>
			{#each data.pastors as pastor (pastor.id)}
				<details class="admin-item">
					<summary
						><span>{pastor.full_name} · {pastor.institution}</span><span
							>{pastor.is_published ? 'Publicado' : 'Privado'}</span
						></summary
					>
					<form class="admin-grid" method="POST" action="?/updatePastor">
						<input type="hidden" name="id" value={pastor.id} />
						<label class="form-field"
							><span>Nombre y apellido *</span><input
								name="full_name"
								value={pastor.full_name}
								maxlength="180"
								required
							/></label
						>
						<label class="form-field"
							><span>Institución o iglesia *</span><input
								name="institution"
								value={pastor.institution}
								maxlength="180"
								required
							/></label
						>
						<label class="form-field"
							><span>Localidad o ciudad *</span><input
								name="city"
								value={pastor.city}
								maxlength="120"
								required
							/></label
						>
						<label class="form-field"
							><span>Provincia *</span><input
								name="province"
								value={pastor.province}
								maxlength="120"
								required
							/></label
						>
						<label class="admin-check wide"
							><input name="is_published" type="checkbox" checked={pastor.is_published} /> Publicar perfil</label
						>
						<button class="solid-button wide" type="submit">Guardar cambios</button>
					</form>
				</details>
			{/each}
		</section>
	{/if}
</div>

<style>
	.admin-tabs a {
		padding: 12px 15px;
		color: var(--color-muted);
		text-decoration: none;
		font-size: 12px;
		font-weight: 700;
	}
	.admin-tabs a:hover {
		color: var(--color-heading);
		border-bottom: 2px solid var(--color-accent);
	}
	.admin-inline {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	dl {
		display: grid;
		grid-template-columns: minmax(170px, 0.35fr) 1fr;
		gap: 7px 14px;
	}
	dt {
		color: var(--color-label);
		font-size: 12px;
		font-weight: 700;
		text-transform: capitalize;
	}
	dd {
		margin: 0;
		white-space: pre-wrap;
		color: var(--color-muted);
		font-size: 12px;
		line-height: 1.6;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}
	@media (max-width: 560px) {
		dl {
			grid-template-columns: 1fr;
			gap: 4px;
		}
		dd {
			margin-bottom: 9px;
		}
	}
</style>
