<script lang="ts">
  import { Search } from 'lucide-svelte';
  import { cn } from '$lib/utils/cn';
  import Input from './Input.svelte';

  interface Props {
    value: string;
    placeholder?: string;
    class?: string;
  }

  let { value = $bindable(), placeholder = "Buscar...", class: className = "" } = $props<Props>();
</script>

<div class={cn("relative flex items-center group", className)}>
  <Search 
    class="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" 
  />
  <Input
    type="text"
    bind:value={value}
    {placeholder}
    class="pl-12 w-full h-[52px] shadow-sm hover:shadow-md focus:shadow-lg transition-all border-gray-100 !rounded-3xl"
  />
</div>
