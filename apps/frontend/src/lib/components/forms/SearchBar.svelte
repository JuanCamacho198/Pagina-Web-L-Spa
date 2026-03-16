<script lang="ts">
  import { cn } from '$lib/utils/cn';

  let { 
    value = $bindable(), 
    placeholder = "Buscar...", 
    class: className = "" 
  } = $props();
</script>

<div class={cn("relative flex items-center group w-full", className)}>
  <input
    type="text"
    bind:value={value}
    {placeholder}
    class="w-full h-13 bg-white border-0 border-b-2 border-secondary rounded-none outline-none shadow-sm hover:shadow-md focus:shadow-lg focus:border-primary transition-all duration-500 px-6 text-gray-700 placeholder:text-gray-400"
  />
</div>
