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
    class="w-full h-13 bg-white border border-gray-100 rounded-4xl outline-none shadow-sm hover:shadow-md focus:shadow-lg focus:border-primary transition-all px-6 text-gray-700 placeholder:text-gray-400"
  />
</div>
