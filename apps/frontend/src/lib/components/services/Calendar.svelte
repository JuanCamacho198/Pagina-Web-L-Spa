<script lang="ts">
  import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-svelte";
  import { cn } from "$lib/utils/cn";
  import Typography from "../ui/Typography.svelte";
  import { CalendarLogic, type CalendarProps } from "$lib/logic/CalendarLogic";

  interface Props {
    selectedDate?: string;
    onDateSelect: (date: string) => void;
    minDate?: string;
    maxDate?: string;
  }

  let props: Props = $props();
  
  const logic = new CalendarLogic(props);
</script>

<div class="p-4 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-sm mx-auto">
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-3">
      <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <CalendarIcon size={20} strokeWidth={2.5} />
      </div>
      <div>
        <Typography variant="h4" class="text-gray-900 mb-0! font-bold">
          {logic.months[logic.currentMonth.getMonth()]}
        </Typography>
        <Typography variant="small" class="text-gray-400 font-medium">
          {logic.currentMonth.getFullYear()}
        </Typography>
      </div>
    </div>
    <div class="flex gap-2">
      <button
        onclick={logic.prevMonth}
        class="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-50 border border-gray-100 transition-all active:scale-90"
      >
        <ChevronLeft size={20} class="text-gray-600" />
      </button>
      <button
        onclick={logic.nextMonth}
        class="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-50 border border-gray-100 transition-all active:scale-90"
      >
        <ChevronRight size={20} class="text-gray-600" />
      </button>
    </div>
  </div>

  <div class="grid grid-cols-7 gap-1 mb-2">
    {#each logic.daysOfWeek as day}
      <div class="h-10 w-10 flex items-center justify-center">
        <Typography variant="small" class="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
          {day}
        </Typography>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-7 gap-1">
    {#each Array(logic.startOffset) as _}
      <div class="h-10 w-10"></div>
    {/each}

    {#each Array(logic.totalDays) as _, i}
      {@const d = i + 1}
      {@const disabled = logic.isDisabled(d)}
      {@const selected = logic.isSelected(d, vars.selectedDate)}
      {@const today = logic.isToday(d)}

      <button
        onclick={() => logic.handleDateClick(d)}
        disabled={disabled}
        class={cn(
          "h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all font-medium relative focus:outline-none",
          selected 
            ? "bg-primary text-white font-bold shadow-lg shadow-primary/30 scale-105 z-10" 
            : "hover:bg-primary/10 text-gray-700 active:scale-95",
          today && !selected && "border-2 border-primary/30 text-primary font-bold",
          disabled && "text-gray-200 pointer-events-none"
        )}
      >
        {d}
        {#if today && !selected}
          <span class="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></span>
        {/if}
      </button>
    {/each}
  </div>
</div>