import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  selectedDate: string;
  durationMinutes?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TimePicker({
  selectedDate,
  durationMinutes = 60,
  value,
  onChange,
  disabled = false,
}: TimePickerProps) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek === 0) {
      // Domingo, no hay horarios disponibles
      setAvailableTimes([]);
      return;
    }

    // horario laboral, de 9:00 a 18:00
    const workStartHour = 9;
    const workEndHour = 18;

    //la duración del servicio como intervalo
    const intervalMinutes = durationMinutes;

    const slots: string[] = [];

    //iteramos desde la hora inicial hasta la última hora en la que el servicio puede empezar
    const totalWorkMinutes = (workEndHour - workStartHour) * 60;
    const lastStartMinute = totalWorkMinutes - durationMinutes;

    for (let minutesFromStart = 0; minutesFromStart <= lastStartMinute; minutesFromStart += intervalMinutes) {
      const hour = Math.floor(minutesFromStart / 60) + workStartHour;
      const minute = minutesFromStart % 60;

      // Formatear hora en 12h con AM/PM
      let displayHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const mm = minute.toString().padStart(2, '0');

      slots.push(`${displayHour}:${mm} ${ampm}`);
    }

    setAvailableTimes(slots);
  }, [selectedDate, durationMinutes]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Clock size={16} />
      </div>
      <select
        id="preferredTime"
        name="preferredTime"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || !selectedDate || availableTimes.length === 0}
        required
        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none disabled:bg-gray-50 disabled:text-gray-400 font-medium text-gray-700"
      >
        <option value="">Selecciona una hora</option>
        {!selectedDate && (
          <option disabled>Selecciona una fecha primero</option>
        )}
        {selectedDate && availableTimes.length === 0 && (
          <option disabled>No hay horarios disponibles</option>
        )}
        {availableTimes.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

