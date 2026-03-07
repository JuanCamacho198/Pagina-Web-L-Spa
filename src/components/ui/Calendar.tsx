import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@components/ui/Button';
import { Typography } from '@components/ui/Typography';

interface CalendarProps {
  selectedDate?: string; // YYYY-MM-DD
  onDateSelect: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day + 1);
    const dateStr = date.toISOString().split('T')[0];
    return dateStr === selectedDate;
  };

  const isDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
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
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    if (isDisabled(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day + 1);
    onDateSelect(date.toISOString().split('T')[0]);
  };

  const calendarDays = [];
  const totalDays = daysInMonth(currentMonth);
  const startOffset = startDayOfMonth(currentMonth);

  for (let i = 0; i < startOffset; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-10 w-10" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const disabled = isDisabled(d);
    calendarDays.push(
      <button
        key={d}
        onClick={() => handleDateClick(d)}
        disabled={disabled}
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all focus:outline-none",
          isSelected(d) ? "bg-primary text-white font-bold shadow-lg scale-110" : "hover:bg-primary/10 text-gray-700",
          isToday(d) && !isSelected(d) && "border-2 border-primary text-primary font-bold",
          disabled && "text-gray-300 pointer-events-none"
        )}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="p-6 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h5" className="m-0 font-bold text-gray-800">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Typography>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>

      <div className="mt-6 flex items-center gap-3 text-xs text-gray-400 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full border border-primary" />
          <span>Hoy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Seleccionado</span>
        </div>
      </div>
    </div>
  );
};
