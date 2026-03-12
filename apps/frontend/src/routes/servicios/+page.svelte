<script lang="ts">
  import ServiceCard from '$components/ServiceCard.svelte';
  let { data } = $props();
  let services = $derived(data.services || []);
</script>

<div class="pt-32 px-10">
  <h1 class="text-4xl font-bold mb-8">Debug Services (with Cards)</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {#each services as service (service.id)}
          <ServiceCard {service} />
      {/each}
  </div>
</div>
