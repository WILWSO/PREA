<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '#lib/assets/favicon.svg';
	import '../lib/themes/index.css';
	import './app.css';
	import ModeSwitch from '../lib/components/ModeSwitch.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<header class="site-header">
	<a class="brand" href={resolve('/')} aria-label="PREA, inicio">
		<img src="/logo.jpeg" alt="" />
		<span><strong>PREA</strong><small>Pastores Reformados<br />en Argentina</small></span>
	</a>
	<nav aria-label="Navegación principal">
		<a href={resolve('/#identidad')}>Identidad</a>
		<a href={resolve('/agenda')}>Agenda</a>
		<a href={resolve('/directorio')}>Directorio</a>
	</nav>
	<div class="header-tools">
		<ModeSwitch initial={data.colorMode} />
		<a class="header-action" href={resolve('/solicitud')}>Vincularme <span>↗</span></a>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="site-footer">
	<a class="footer-brand" href={resolve('/')}
		>PREA <span>/</span> Pastores Reformados en Argentina</a
	>
	<p>Fomentando comunión, convicción y misión en toda Argentina.</p>
	<div class="footer-links">
		<a href={resolve('/solicitud')}>Vinculación</a><a href={resolve('/admin')}
			>Acceso institucional</a
		>
	</div>
	<small>© {new Date().getFullYear()} PREA · Pastores Reformados en Argentina</small>
</footer>
