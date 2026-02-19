import React, { useState } from 'react';

const CalendarView = ({ appointments, onDateSelect, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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

        // Empty slots for days before the first day of the month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const hasAppointments = appointments.some(app => app.date === dateStr);
            const isPast = new Date(dateStr) < new Date().setHours(0, 0, 0, 0);

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${hasAppointments ? 'has-appointment' : ''} ${hasAppointments && isPast ? 'past' : ''}`}
                    onClick={() => onDateSelect(dateStr)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar-card">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-weekdays">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="calendar-grid">
                {renderDays()}
            </div>
            <div className="calendar-legend">
                <div className="legend-item"><span className="dot dot-future"></span> Upcoming</div>
                <div className="legend-item"><span className="dot dot-past"></span> Past</div>
            </div>
        </div>
    );
};

export default CalendarView;
