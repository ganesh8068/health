import React, { useState } from 'react';

const CalendarView = ({ appointments, onDateSelect, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getMonthName = (index) => monthNames[index];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = [];
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            // Format date as YYYY-MM-DD manually to avoid timezone issues with toISOString
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            // Check if any appointment exists for this date
            // appointments might be undefined initially, safeguard it
            const hasAppointments = appointments && appointments.some(app => app.date === dateStr);
            const isPast = new Date(dateStr) < new Date().setHours(0, 0, 0, 0);

            days.push(
                <div
                    key={day}
                    onClick={() => onDateSelect(dateStr)}
                    className={`
                        aspect-square flex flex-col items-center justify-center text-sm font-medium rounded-xl cursor-pointer transition-all relative
                        ${isSelected 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105 z-10' 
                            : 'bg-white hover:bg-secondary-50 text-secondary-700 hover:text-primary-600 border border-transparent hover:border-primary-100'}
                        ${hasAppointments && !isSelected ? 'font-bold text-primary-600 bg-primary-50/50' : ''}
                        ${isPast && !isSelected ? 'opacity-60 grayscale' : ''}
                    `}
                >
                    {day}
                    {hasAppointments && (
                        <div className={`mt-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary-500'}`}></div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-secondary-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={handlePrevMonth}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 hover:bg-white hover:text-primary-600 hover:shadow-md transition-all font-bold text-lg"
                >
                    &lt;
                </button>
                <div className="text-xl font-display font-bold text-secondary-900">
                    {getMonthName(currentDate.getMonth())} <span className="text-primary-600">{currentDate.getFullYear()}</span>
                </div>
                <button 
                    onClick={handleNextMonth}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 hover:bg-white hover:text-primary-600 hover:shadow-md transition-all font-bold text-lg"
                >
                    &gt;
                </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-secondary-400 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {renderDays()}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-secondary-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-secondary-500">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                    Appointment
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-secondary-500">
                    <div className="w-2 h-2 rounded-full bg-secondary-300"></div>
                    Past
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
