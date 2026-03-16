<script lang="ts">
	import Typography from '$lib/components/ui/Typography.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Trash2 } from 'lucide-svelte';

	let {
		onCancel,
		onClose,
		isLoading = false
	}: {
		onCancel: () => void;
		onClose: () => void;
		isLoading?: boolean;
	} = $props();
</script>

<div class="text-center p-4">
	<div class="w-20 h-130 bg-rose-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 text-rose-500">
		<Trash2 size={40} />
	</div>
	<Typography variant="h3" class="text-gray-900 font-black mb-3">¿Estás seguro?</Typography>
	<p class="text-gray-500 font-medium mb-8 leading-relaxed">
		Esta acción no se puede deshacer. Tu espacio reservado quedará disponible para otros clientes.
	</p>
</div>
{#snippet footer()}
	<Button variant="ghost" onclick={onClose} class="rounded-4xl font-black uppercase tracking-widest">No, mantener</Button>
	<Button onclick={onCancel} isLoading={isLoading} class="rounded-4xl px-8 bg-rose-500 hover:bg-rose-600 shadow-rose-200 font-black uppercase tracking-widest">Sí, cancelar</Button>
{/snippet}
