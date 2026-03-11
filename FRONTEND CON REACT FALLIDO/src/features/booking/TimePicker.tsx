import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { fetchReservedTimes } from '@/models/bookingModel';
import { cn } from '@/lib/utils';

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
  const [availableTimes, setAvailableTimes] = useState<{time: string, isReserved: boolean}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTimes = async () => {
      if (!selectedDate) {
        setAvailableTimes([]);
        return;
      }

      setLoading(true);
      try {
        const dateObj = new Date(selectedDate);
        const dayOfWeek = dateObj.getDay();

        if (dayOfWeek === 0) {
          setAvailableTimes([]);
          return;
        }

        const reservedTimes = await fetchReservedTimes(selectedDate);

        // horario laboral, de 9:00 a 18:00
        const workStartHour = 9;
        const workEndHour = 18;
        const intervalMinutes = durationMinutes;
        const slots: {time: string, isReserved: boolean}[] = [];

        const totalWorkMinutes = (workEndHour - workStartHour) * 60;
        const lastStartMinute = totalWorkMinutes - durationMinutes;

        for (let minutesFromStart = 0; minutesFromStart <= lastStartMinute; minutesFromStart += intervalMinutes) {
          const hour = Math.floor(minutesFromStart / 60) + workStartHour;
          const minute = minutesFromStart % 60;

          let displayHour = hour % 12 || 12;
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const mm = minute.toString().padStart(2, '0');
          const timeString = `${displayHour}:${mm} ${ampm}`;

          slots.push({
            time: timeString,
            isReserved: reservedTimes.includes(timeString)
          });
        }

        setAvailableTimes(slots);
      } catch (error) {
        console.error("Error generating time slots:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTimes();
  }, [selectedDate, durationMinutes]);

  if (!selectedDate) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 flex items-center gap-3 animate-pulse">
        <AlertCircle size={20} />
        <p className="text-sm font-medium">Selecciona una fecha para ver horarios disponibles</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        <Clock size={16} />
        <span className="text-sm font-bold uppercase tracking-wider">Horarios Disponibles</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {availableTimes.length === 0 ? (
          <p className="col-span-full text-center py-4 text-gray-400 italic">No hay horarios disponibles para este día</p>
        ) : (
          availableTimes.map(({ time, isReserved }) => (
            <button
              key={time}
              type="button"
              disabled={disabled || isReserved}
              onClick={() => onChange(time)}
              className={cn(
                "py-2.5 px-3 rounded-xl border-2 transition-all duration-200 text-sm font-bold",
                value === time 
                  ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                  : isReserved 
                    ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through" 
                    : "border-gray-100 bg-white text-gray-600 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              )}
            >
              {time}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

