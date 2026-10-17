<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head><title>Directorio pastoral | PREA</title></svelte:head>
<section class="page-hero">
	<p class="eyebrow">Comunidad reformada</p>
	<h1>Directorio pastoral</h1>
	<p>Pastores e instituciones vinculados que han autorizado la publicación de estos datos.</p>
</section>
<section class="content-section">
	{#if data.pastors.length}
		<div class="directory-list">
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
		<div class="empty-note">Todavía no hay perfiles publicados en el directorio.</div>
	{/if}
</section>
