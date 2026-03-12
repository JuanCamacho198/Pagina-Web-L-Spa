<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import ReviewList from './ReviewList.svelte';
  import ReviewForm from '../forms/ReviewForm.svelte';

  interface Props {
    serviceId: string;
  }

  let props: Props = $props();
  const { serviceId } = $derived(props);
  let refreshTrigger = $state(0);

  const handleReviewSubmitted = () => {
    refreshTrigger += 1;
  };
</script>

<div class="space-y-12">
  <div class="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 sm:p-12 border border-gray-100 shadow-sm">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div>
        <h2 class="text-4xl font-black text-gray-900 tracking-tight mb-2">Reseñas de Clientes</h2>
        <p class="text-gray-500 font-medium">Lo que dicen nuestros visitantes sobre esta experiencia.</p>
      </div>
      <div class="h-1.5 w-24 bg-primary rounded-full hidden md:block opacity-20"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
      <!-- Reviews List -->
      <div class="lg:col-span-7">
        <ReviewList {serviceId} key={refreshTrigger} />
      </div>

      <!-- Review Form -->
      <div class="lg:col-span-5 sticky top-32">
        <div class="bg-gray-50/50 rounded-4xl p-8 border border-gray-100 shadow-inner">
          <ReviewForm {serviceId} onSubmitted={handleReviewSubmitted} />
        </div>
      </div>
    </div>
  </div>
</div>
