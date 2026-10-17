<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { doctrinalFields, identityFields } from '../../lib/application-fields';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let step = $state(0);
	let formElement: HTMLFormElement;
	let values: Record<string, string> = $state({});

	const steps = [
		{
			title: 'Identificación pastoral',
			detail: 'Contanos quién sos y a qué comunidad representás.'
		},
		{
			title: 'Convicciones doctrinales',
			detail: 'Compartí tu postura y sus fundamentos bíblicos y confesionales.'
		}
	];

	function nextStep() {
		if (formElement.reportValidity()) step = 1;
	}

	function previousStep() {
		step = 0;
	}
</script>

<svelte:head>
	<title>Solicitud de vinculación | PREA</title>
	<meta
		name="description"
		content="Formulario privado de solicitud de vinculación pastoral con PREA."
	/>
</svelte:head>

<section class="page-hero">
	<p class="eyebrow">Vinculación pastoral</p>
	<h1>Comencemos una conversación.</h1>
	<p>
		Esta solicitud confidencial permite al Consejo conocer tu recorrido y tus convicciones
		doctrinales. Enviar el formulario no implica una aprobación automática.
	</p>
</section>

<form class="form-shell" method="POST" action="?/submit" bind:this={formElement} use:enhance>
	<div class="form-progress" aria-label={`Paso ${step + 1} de ${steps.length}`}>
		{#each steps as item, index (item.title)}
			<span class:active={index <= step} aria-label={item.title}></span>
		{/each}
	</div>

	{#if form?.error}
		<p class="alert" role="alert">{form.error}</p>
	{/if}
	{#if form?.success}
		<div class="alert success" role="status">
			<strong>Tu solicitud fue recibida.</strong>
			{#if form.emailWarning}
				El registro quedó guardado, pero no pudimos confirmar el envío de los avisos por correo. El
				equipo de PREA revisará la solicitud.
			{:else}
				Te enviamos una confirmación por correo. El Consejo revisará la información y se comunicará
				cuando haya una resolución.
			{/if}
		</div>
	{/if}

	<p class="step-label">Paso {step + 1} de {steps.length}</p>
	<h2>{steps[step].title}</h2>
	<p class="form-intro">{steps[step].detail}</p>

	<div class="trap" aria-hidden="true">
		<label for="website">Dejá este campo vacío</label>
		<input id="website" name="website" tabindex="-1" autocomplete="off" />
	</div>

	{#if step === 0}
		<div class="form-fields">
			{#each identityFields as field (field.name)}
				<div class:full-width={field.type === 'textarea'} class="form-field">
					<label for={field.name}>{field.label} *</label>
					{#if field.type === 'textarea'}
						<textarea id={field.name} required maxlength="5000" bind:value={values[field.name]}
						></textarea>
					{:else}
						<input
							id={field.name}
							type={field.type}
							required
							maxlength="5000"
							autocomplete={field.name === 'email'
								? 'email'
								: field.name === 'full_name'
									? 'name'
									: 'off'}
							bind:value={values[field.name]}
						/>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="form-fields">
			{#each doctrinalFields as field (field.name)}
				<div class="form-field full-width">
					<label for={field.name}>{field.label} *</label>
					<textarea
						id={field.name}
						required
						maxlength="5000"
						placeholder="Describí tu postura y, cuando sea posible, citá su fundamento bíblico o confesional."
						bind:value={values[field.name]}></textarea>
				</div>
			{/each}
			<label class="privacy-check full-width">
				<input type="checkbox" name="privacy_consent" required />
				<span
					>Confirmo que la información es correcta y leí el aviso sobre el uso confidencial de estos
					datos.</span
				>
			</label>
		</div>
	{/if}

	{#each Object.entries(values) as [name, value] (name)}
		<input type="hidden" {name} {value} />
	{/each}

	<div class="form-actions">
		{#if step === 1}
			<button class="plain-button" type="button" onclick={previousStep}>← Volver</button>
		{:else}
			<a class="plain-button" href={resolve('/')}>Cancelar</a>
		{/if}
		{#if step === 0}
			<button class="solid-button" type="button" onclick={nextStep}>Siguiente sección →</button>
		{:else}
			<button class="solid-button" type="submit">Enviar solicitud →</button>
		{/if}
	</div>
	<p class="privacy-note">
		Los datos completos solo serán accesibles para usuarios autorizados de PREA y se utilizarán para
		evaluar esta solicitud. La publicación de datos en el directorio público es independiente y
		requiere una acción del equipo autorizado.
	</p>
</form>

<style>
	.privacy-check {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		color: var(--color-muted);
		font-size: 12px;
		line-height: 1.6;
	}
	.privacy-check input {
		flex: none;
		margin-top: 3px;
		accent-color: var(--color-primary);
	}
</style>
