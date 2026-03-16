<script lang="ts">
	import type { Component } from 'svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	let {
		isOpen = false,
		onClose,
		title = '',
		size = 'md',
		componentPath = ''
	}: {
		isOpen?: boolean;
		onClose: () => void;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		componentPath?: string;
	} = $props();

	let componentPromise: Promise<{ default: Component }> | null = $state(null);

	$effect(() => {
		if (isOpen && componentPath) {
			componentPromise = import(componentPath);
		} else {
			componentPromise = null;
		}
	});
</script>

{#if isOpen}
	<Modal {isOpen} {onClose} {title} {size}>
		{#if componentPromise}
			{#await componentPromise}
				<div class="flex items-center justify-center p-12">
					<div class="flex flex-col items-center gap-4">
						<div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
						<p class="text-gray-500">Cargando...</p>
					</div>
				</div>
			{:then { default: Component }}
				<Component />
			{:catch error}
				<div class="text-center p-4">
					<p class="text-red-500">
						Error al cargar el componente. Por favor, intenta de nuevo.
					</p>
				</div>
			{/await}
		{/if}
	</Modal>
{/if}
