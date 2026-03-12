<script lang="ts">
  import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-svelte';
  import { cn } from '$lib/utils/cn';
  import Typography from './Typography.svelte';

  interface Props {
    selectedDate?: string; // YYYY-MM-DD
    onDateSelect: (date: string) => void;
    minDate?: string;
    maxDate?: string;
  }

  let { selectedDate, onDateSelect, minDate, maxDate } = $props<Props>();

  let currentMonth = $state(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Ajustar para que la semana empiece en Lunes (0=Dom, 1=Lun...)
    return day === 0 ? 6 : day - 1;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    // Usar el mediodía para evitar problemas de zona horaria al formatear
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    return dateStr === selectedDate;
  };

  const isDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const prevMonth = () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
  };

  const nextMonth = () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  };

  const handleDateClick = (day: number) => {
    if (isDisabled(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12, 0, 0);
    onDateSelect(date.toISOString().split('T')[0]);
  };

  // Derivados reactivos
  let totalDays = $derived(daysInMonth(currentMonth));
  let startOffset = $derived(startDayOfMonth(currentMonth));
</script>

<div class="p-4 bg-white rounded-4xl shadow-xl border border-gray-100 max-w-sm mx-auto">
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-3">
      <div class="h-10 w-px0 rounded-4xl bg-primary/10 flex items-center justify-center text-primary">
        <CalendarIcon size={20} strokeWidth={2.5} />
      </div>
      <div>
        <Typography variant="h4" class="text-gray-900 mb-0! font-bold">
          {months[currentMonth.getMonth()]}
        </Typography>
        <Typography variant="small" class="text-gray-400 font-medium">
          {currentMonth.getFullYear()}
        </Typography>
      </div>
    </div>
    <div class="flex gap-2">
      <button
        onclick={prevMonth}
        class="h-10 w-px0 flex items-center justify-center rounded-4xl hover:bg-gray-50 border border-gray-100 transition-all active:scale-90"
      >
        <ChevronLeft size={20} class="text-gray-600" />
      </button>
      <button
        onclick={nextMonth}
        class="h-10 w-px0 flex items-center justify-center rounded-4xl hover:bg-gray-50 border border-gray-100 transition-all active:scale-90"
      >
        <ChevronRight size={20} class="text-gray-600" />
      </button>
    </div>
  </div>

  <div class="grid grid-cols-7 gap-1 mb-2">
    {#each daysOfWeek as day}
      <div class="h-10 w-px0 flex items-center justify-center">
        <Typography variant="small" class="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
          {day}
        </Typography>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-7 gap-1">
    {#each Array(startOffset) as _}
      <div class="h-10 w-px0"></div>
    {/each}

    {#each Array(totalDays) as _, i}
      {@const d = i + 1}
      {@const disabled = isDisabled(d)}
      {@const selected = isSelected(d)}
      {@const today = isToday(d)}

      <button
        onclick={() => handleDateClick(d)}
        disabled={disabled}
        class={cn(
          "h-10 w-px0 rounded-4xl flex items-center justify-center text-sm transition-all font-medium relative focus:outline-none",
          selected 
            ? "bg-primary text-white font-bold shadow-lg shadow-primary/30 scale-105 z-10" 
            : "hover:bg-primary/10 text-gray-700 active:scale-95",
          today && !selected && "border-2 border-primary/30 text-primary font-bold",
          disabled && "text-gray-200 pointer-events-none"
        )}
      >
        {d}
        {#if today && !selected}
          <span class="absolute bottom-1 w-px h-1 bg-primary rounded-full"></span>
        {/if}
      </button>
    {/each}
  </div>
</div>
