<script lang="ts">
  import { Check } from 'lucide-svelte';
  import { cn } from '$lib/utils/cn';
  import Typography from '../ui/Typography.svelte';

  interface Step {
    id: number;
    label: string;
    description?: string;
  }

  interface Props {
    steps: Step[];
    currentStep: number;
    class?: string;
  }

  let props: Props = $props();
  const { steps, currentStep, class: className = "" } = $derived(props);
</script>

<div class={cn("w-full flex items-center justify-between relative", className)}>
  {#each steps as step, index}
    {@const isCompleted = index < currentStep}
    {@const isActive = index === currentStep}

    <!-- Step Item -->
    <div class="flex flex-col items-center relative z-10 basis-0 grow">
      <div
        class={cn(
          "w-px2 h-12 rounded-[18px] flex items-center justify-center transition-all duration-500 font-bold text-lg",
          isCompleted 
            ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" 
            : isActive 
              ? "bg-white text-primary border-4 border-primary scale-125 shadow-xl ring-8 ring-primary/5" 
              : "bg-gray-50 text-gray-300 border-2 border-gray-100"
        )}
      >
        {#if isCompleted}
          <div class="animate-in zoom-in duration-300">
            <Check size={24} strokeWidth={3} />
          </div>
        {:else}
          <span class={cn(isActive && "animate-pulse")}>{step.id}</span>
        {/if}
      </div>

      <div class="absolute top-16 text-center w-max min-w-30 px-2">
        <Typography 
          variant="small" 
          class={cn(
            "font-bold mb-0! transition-all duration-300 uppercase tracking-wider text-[11px]",
            isActive || isCompleted ? "text-primary opacity-100 translate-y-0" : "text-gray-400 opacity-40 translate-y-1"
          )}
        >
          {step.label}
        </Typography>
        {#if step.description}
          <p class="text-[9px] font-medium text-gray-400 leading-tight mt-1 max-w-25 mx-auto hidden sm:block opacity-60">
            {step.description}
          </p>
        {/if}
      </div>
    </div>

    <!-- Progress Line -->
    {#if index < steps.length - 1}
      <div class="relative flex-1 h-1.5 bg-gray-50 -mt-10 -mx-8 rounded-full overflow-hidden border border-gray-100/50">
        <div
          class="absolute left-0 top-0 h-full bg-primary transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(140,27,88,0.4)]"
          style:width={isCompleted ? '100%' : '0%'}
        ></div>
      </div>
    {/if}
  {/each}
</div>
