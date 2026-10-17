<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const dateFormat = new Intl.DateTimeFormat('es-AR', {
		dateStyle: 'long',
		timeZone: 'America/Argentina/Buenos_Aires'
	});
</script>

<svelte:head>
	<title>PREA | Pastores Reformados en Argentina</title>
	<meta
		name="description"
		content="Una comunidad interdenominacional de pastores e iglesias reformadas en Argentina."
	/>
</svelte:head>

<section class="hero">
	<div class="hero-copy">
		<p class="eyebrow">Pastores Reformados en Argentina</p>
		<h1>Una fe compartida.<br /><span>Una iglesia fortalecida.</span></h1>
		<p class="lead">
			Promovemos la comunión, la confesionalidad y la colaboración entre pastores e iglesias
			reformadas de todo el país.
		</p>
		<div class="hero-actions">
			<a class="button button-light" href={resolve('/solicitud')}
				>Solicitar vinculación <span>→</span></a
			>
			<a class="text-link" href="#identidad">Conocé PREA</a>
		</div>
		<div class="hero-note"><span class="status-dot"></span> Interdenominacional y confesional</div>
	</div>
	<div class="hero-mark">
		<div class="mark-frame">
			<img src="/logo.jpeg" alt="Logo de Pastores Reformados en Argentina" />
		</div>
		<p>Comunión · Convicción · Misión</p>
	</div>
</section>

<section class="section intro" id="identidad">
	<div class="section-kicker">Nuestra identidad <span>01 / 03</span></div>
	<div class="intro-grid">
		<h2>Unidos por el evangelio,<br />arraigados en la Palabra.</h2>
		<div>
			<p>
				PREA vincula a pastores e iglesias reformadas en Argentina para fomentar la fe reformada,
				servir a la iglesia local y promover espacios de comunión y respaldo mutuo.
			</p>
			<p>
				Somos interdenominacionales y confesionales. Recibimos solicitudes de pastores que abrazan
				las confesiones históricas reformadas y sus catecismos.
			</p>
			<a class="inline-link" href={resolve('/#admission')}
				>Conocé el proceso de vinculación <span>↗</span></a
			>
		</div>
	</div>
</section>

<section class="section events-section" id="agenda">
	<div class="section-heading">
		<div>
			<div class="section-kicker">Agenda <span>02 / 03</span></div>
			<h2>Encuentros que edifican.</h2>
		</div>
		<a class="inline-link" href={resolve('/agenda')}>Ver agenda <span>↗</span></a>
	</div>
	{#if data.events.length}
		<div class="event-grid">
			{#each data.events as event (event.id)}
				<article class="event-card">
					<div class="event-date">
						<span>{dateFormat.format(new Date(event.starts_at))}</span>
						<span class="event-arrow">↗</span>
					</div>
					<h3>{event.title}</h3>
					<p>{event.description}</p>
					{#if event.location}<p class="event-location">⌖ {event.location}</p>{/if}
					{#if event.registration_url}
						<a href={event.registration_url} target="_blank" rel="noreferrer">Inscribirme</a>
					{/if}
				</article>
			{/each}
		</div>
	{:else}
		<div class="empty-note">Próximamente compartiremos las próximas actividades de PREA.</div>
	{/if}
</section>

<section class="section directory-section" id="directorio">
	<div class="section-heading">
		<div>
			<div class="section-kicker">Comunidad <span>03 / 03</span></div>
			<h2>Pastores vinculados.</h2>
		</div>
		<a class="inline-link" href={resolve('/directorio')}>Ver directorio <span>↗</span></a>
	</div>
	{#if data.pastors.length}
		<div class="pastor-grid">
			{#each data.pastors as pastor (pastor.id)}
				<article class="pastor-card">
					<div class="pastor-monogram">{pastor.full_name.slice(0, 1)}</div>
					<div>
						<h3>{pastor.full_name}</h3>
						<p>{pastor.institution}</p>
						<span>{pastor.city}, {pastor.province}</span>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<div class="empty-note">
			El directorio público se actualizará a medida que se vinculen pastores.
		</div>
	{/if}
</section>

<section class="cta-band" id="admission">
	<div>
		<p class="eyebrow">Caminemos juntos</p>
		<h2>¿Sos pastor reformado en Argentina?</h2>
		<p>Conocé el proceso de vinculación y compartí tus convicciones doctrinales con el Consejo.</p>
	</div>
	<a class="button button-light" href={resolve('/solicitud')}>Iniciar solicitud <span>→</span></a>
</section>
