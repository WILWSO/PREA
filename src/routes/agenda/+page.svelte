<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const dateFormat = new Intl.DateTimeFormat('es-AR', {
		dateStyle: 'long',
		timeZone: 'America/Argentina/Buenos_Aires'
	});
</script>

<svelte:head><title>Agenda | PREA</title></svelte:head>
<section class="page-hero">
	<p class="eyebrow">Encuentros PREA</p>
	<h1>Agenda</h1>
	<p>
		Actividades y encuentros para cultivar comunión y fortalecer la iglesia reformada en Argentina.
	</p>
</section>
<section class="content-section">
	{#if data.events.length}
		<div class="event-list">
			{#each data.events as event (event.id)}
				<article class="event-card">
					<div class="event-date">{dateFormat.format(new Date(event.starts_at))}</div>
					<h3>{event.title}</h3>
					<p>{event.description}</p>
					{#if event.location}<p class="event-location">⌖ {event.location}</p>{/if}
					{#if event.registration_url}
						<a href={event.registration_url} target="_blank" rel="noreferrer"
							>Más información e inscripción ↗</a
						>
					{/if}
				</article>
			{/each}
		</div>
	{:else}
		<div class="empty-note">
			No hay eventos próximos publicados. Volvé pronto para conocer las novedades.
		</div>
	{/if}
</section>
