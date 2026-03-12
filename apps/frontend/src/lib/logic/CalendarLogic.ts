export interface CalendarProps {
    selectedDate?: string; // YYYY-MM-DD
    onDateSelect: (date: string) => void;
    minDate?: string;
    maxDate?: string;
}

export class CalendarLogic {
    currentMonth = $state(new Date());
    selectedDate: string | undefined;
    onDateSelect: (date: string) => void;
    minDate: string | undefined;
    maxDate: string | undefined;

    months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    constructor(props: CalendarProps) {
        this.selectedDate = props.selectedDate;
        this.onDateSelect = props.onDateSelect;
        this.minDate = props.minDate;
        this.maxDate = props.maxDate;
    }

    // Usar getters para valores derivados
    get totalDays() {
        return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();
    }

    get startOffset() {
        const day = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1).getDay();
        // Ajustar para que la semana empiece en Lunes (0=Dom, 1=Lun...)
        return day === 0 ? 6 : day - 1;
    }

    isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            this.currentMonth.getMonth() === today.getMonth() &&
            this.currentMonth.getFullYear() === today.getFullYear()
        );
    };

    isSelected = (day: number, currentSelectedDate: string | undefined) => {
        if (!currentSelectedDate) return false;
        const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day, 12, 0, 0);
        const dateStr = date.toISOString().split('T')[0];
        return dateStr === currentSelectedDate;
    };

    isDisabled = (day: number) => {
        const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day, 12, 0, 0);
        const dateStr = date.toISOString().split('T')[0];
        
        if (this.minDate && dateStr < this.minDate) return true;
        if (this.maxDate && dateStr > this.maxDate) return true;
        return false;
    };

    prevMonth = () => {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    };

    nextMonth = () => {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    };

    handleDateClick = (day: number) => {
        if (this.isDisabled(day)) return;
        const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day, 12, 0, 0);
        this.onDateSelect(date.toISOString().split('T')[0]);
    };
}
