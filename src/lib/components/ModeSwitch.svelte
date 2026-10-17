<script lang="ts">
	import { colorModeCookie, type ColorMode } from '../theme';

	let { initial }: { initial: ColorMode } = $props();

	const options: { value: ColorMode; label: string; icon: string }[] = [
		{ value: 'auto', label: 'Automático', icon: '◐' },
		{ value: 'light', label: 'Claro', icon: '☀' },
		{ value: 'dark', label: 'Oscuro', icon: '☾' }
	];

	let mode = $derived(initial);

	function choose(value: ColorMode) {
		mode = value;
		const root = document.documentElement;
		root.dataset.mode = value;
		root.dataset.scheme =
			value === 'auto'
				? window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light'
				: value;
		const secure = location.protocol === 'https:' ? '; secure' : '';
		document.cookie = `${colorModeCookie}=${value}; path=/; max-age=31536000; samesite=lax${secure}`;
	}
</script>

<div class="mode-switch" role="group" aria-label="Modo de color">
	{#each options as option (option.value)}
		<button
			type="button"
			aria-pressed={mode === option.value}
			aria-label={option.label}
			title={option.label}
			onclick={() => choose(option.value)}
		>
			<span aria-hidden="true">{option.icon}</span>
		</button>
	{/each}
</div>

<style>
	.mode-switch {
		display: inline-flex;
		padding: 3px;
		gap: 2px;
		border: 1px solid var(--color-border-strong);
		border-radius: 999px;
	}
	button {
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		border-radius: 50%;
		color: var(--color-nav);
		background: transparent;
		font-size: 14px;
		line-height: 1;
		cursor: pointer;
	}
	button:hover {
		color: var(--color-link-hover);
	}
	button[aria-pressed='true'] {
		color: var(--color-primary-contrast);
		background: var(--color-primary);
	}
	button:focus-visible {
		outline: 2px solid var(--color-focus);
		outline-offset: 2px;
	}
</style>
