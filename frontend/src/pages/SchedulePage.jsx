import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CalendarView from '../components/CalendarView';
import { fetchAppointments, updateAppointment, rescheduleAppointment } from '../services/api';

const SchedulePage = ({ user, setUser }) => {
    const [appointments, setAppointments] = useState([]);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [rescheduleData, setRescheduleData] = useState({ date: '', timeSlot: '' });

    const loadAppointments = async () => {
        try {
            const { data } = await fetchAppointments();
            setAppointments(data);
        } catch (err) {
            console.error("Failed to load appointments");
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await updateAppointment(id, 'rejected'); // Using 'rejected' as 'cancelled'
            alert("Appointment Cancelled");
            loadAppointments();
        } catch (err) {
            alert("Failed to cancel appointment");
        }
    };

    const openReschedule = (app) => {
        setSelectedApp(app);
        setRescheduleData({ date: app.date, timeSlot: app.timeSlot });
        setShowRescheduleModal(true);
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            await rescheduleAppointment(selectedApp._id, rescheduleData);
            alert("Appointment Rescheduled Successfully!");
            setShowRescheduleModal(false);
            loadAppointments();
        } catch (err) {
            alert("Failed to reschedule");
        }
    };

    const filteredForDate = appointments.filter(app => app.date === selectedDate);

    return (
        <div className="schedule-page">
            <Navbar user={user} setUser={setUser} />
            <div className="container">
                <header className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>{user.user.role === 'doctor' ? 'My Schedule' : 'My Appointments'}</h1>
                        <p>Manage and track your medical visits</p>
                    </div>
                    <div className="view-toggle">
                        <button className={`btn-toggle ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>Calendar View</button>
                        <button className={`btn-toggle ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>List View</button>
                    </div>
                </header>

                <div className="schedule-grid" style={{ display: 'grid', gridTemplateColumns: viewMode === 'calendar' ? '400px 1fr' : '1fr', gap: '2rem' }}>
                    {viewMode === 'calendar' && (
                        <div className="calendar-sidebar">
                            <div className="card">
                                <CalendarView
                                    appointments={appointments}
                                    onDateSelect={(date) => setSelectedDate(date)}
                                    selectedDate={selectedDate}
                                />
                            </div>
                        </div>
                    )}

                    <div className="appointments-list-container">
                        <div className="card" style={{ padding: '2rem' }}>
                            <h3>Appointments for {selectedDate}</h3>
                            {filteredForDate.length > 0 ? (
                                <div className="appointments-grid">
                                    {filteredForDate.map(app => (
                                        <div key={app._id} className="appointment-card-detailed">
                                            <div className="info">
                                                <span className="time">{app.timeSlot}</span>
                                                <div className="details">
                                                    <strong>{user.user.role === 'patient' ? app.doctorName : app.patientName}</strong>
                                                    <p>{app.department} • {app.reason || 'No reason provided'}</p>
                                                </div>
                                            </div>
                                            <div className="actions">
                                                <span className={`badge bg-${app.status}`}>{app.status}</span>
                                                {app.status === 'pending' || app.status === 'approved' ? (
                                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                                        <button className="btn btn-sm btn-outline" onClick={() => openReschedule(app)}>Reschedule</button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleCancel(app._id)}>Cancel</button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="empty-state">No appointments scheduled for this date.</p>}
                        </div>

                        {viewMode === 'list' && (
                            <div className="card" style={{ marginTop: '2rem', padding: '2rem' }}>
                                <h3>Full List Overview</h3>
                                <table className="app-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ padding: '1rem' }}>Date</th>
                                            <th style={{ padding: '1rem' }}>Time</th>
                                            <th style={{ padding: '1rem' }}>{user.user.role === 'patient' ? 'Doctor' : 'Patient'}</th>
                                            <th style={{ padding: '1rem' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.sort((a, b) => new Date(a.date) - new Date(b.date)).map(app => (
                                            <tr key={app._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                <td style={{ padding: '1rem' }}>{app.date}</td>
                                                <td style={{ padding: '1rem' }}>{app.timeSlot}</td>
                                                <td style={{ padding: '1rem' }}>{user.user.role === 'patient' ? app.doctorName : app.patientName}</td>
                                                <td style={{ padding: '1rem' }}><span className={`badge bg-${app.status}`}>{app.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showRescheduleModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Reschedule Appointment</h2>
                        <form onSubmit={handleRescheduleSubmit}>
                            <div className="form-group">
                                <label>New Date</label>
                                <input type="date" value={rescheduleData.date} onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>New Time Slot</label>
                                <select value={rescheduleData.timeSlot} onChange={e => setRescheduleData({ ...rescheduleData, timeSlot: e.target.value })} required>
                                    <option value="">Select Time</option>
                                    {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'].map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Reschedule</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowRescheduleModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchedulePage;
