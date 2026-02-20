import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CalendarView from '../components/CalendarView';
// import { fetchAppointments, updateAppointment, rescheduleAppointment, updateTreatment } from '../services/api';

const SchedulePage = ({ user, setUser }) => {
    const [appointments, setAppointments] = useState([]);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showTreatmentModal, setShowTreatmentModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [rescheduleData, setRescheduleData] = useState({ date: '', timeSlot: '' });
    const [treatmentData, setTreatmentData] = useState({ treatment: '', prescription: '', notes: '' });

    // Mock Data for UI Dev
    useEffect(() => {
        setAppointments([
            { _id: '1', date: '2023-10-25', timeSlot: '10:00 AM', doctorName: 'Dr. Smith', patientName: 'John Doe', department: 'Cardiology', reason: 'Chest pain', status: 'pending' },
            { _id: '2', date: '2023-10-25', timeSlot: '02:00 PM', doctorName: 'Dr. Jones', patientName: 'Jane Smith', department: 'Dermatology', reason: 'Skin rash', status: 'approved' },
        ]);
        /*
        const loadAppointments = async () => {
             const { data } = await fetchAppointments();
             setAppointments(data);
        }
        loadAppointments();
        */
    }, []);

    const loadAppointments = async () => {
        // Re-fetch logic
    };

    const handleStatusUpdate = async (id, status) => {
        alert(`Appointment ${status} (Simulated)`);
        // await updateAppointment(id, status);
        // loadAppointments();
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        alert("Appointment Cancelled (Simulated)");
        // await updateAppointment(id, 'rejected');
        // loadAppointments();
    };

    const openReschedule = (app) => {
        setSelectedApp(app);
        setRescheduleData({ date: app.date, timeSlot: app.timeSlot });
        setShowRescheduleModal(true);
    };

    const openTreatmentModal = (app) => {
        setSelectedApp(app);
        setTreatmentData({ treatment: app.treatment || '', prescription: app.prescription || '', notes: app.notes || '' });
        setShowTreatmentModal(true);
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        alert("Appointment Rescheduled (Simulated)");
        // await rescheduleAppointment(selectedApp._id, rescheduleData);
        setShowRescheduleModal(false);
        // loadAppointments();
    };

    const handleTreatmentSubmit = async (e) => {
        e.preventDefault();
        alert('Treatment saved (Simulated)');
        // await updateTreatment(selectedApp._id, treatmentData);
        setShowTreatmentModal(false);
        // loadAppointments();
    };

    const filteredForDate = appointments.filter(app => app.date === selectedDate);

    return (
        <div className="min-h-screen bg-secondary-50 pb-10">
            <Navbar user={user} setUser={setUser} />
            <div className="container mx-auto px-4">
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-secondary-900">{user.user?.role === 'doctor' ? 'My Schedule' : 'My Appointments'}</h1>
                        <p className="text-secondary-500 mt-1">{user.user?.role === 'doctor' ? 'Manage patient visits and consultations' : 'Track and manage your medical visits'}</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-secondary-200">
                        <button 
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'calendar' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'}`} 
                            onClick={() => setViewMode('calendar')}
                        >
                            Calendar View
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'}`} 
                            onClick={() => setViewMode('list')}
                        >
                            List View
                        </button>
                    </div>
                </header>

                <div className={`grid gap-8 ${viewMode === 'calendar' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {viewMode === 'calendar' && (
                        <div className="lg:col-span-1">
                            <div className="card h-full">
                                <CalendarView
                                    appointments={appointments}
                                    onDateSelect={(date) => setSelectedDate(date)}
                                    selectedDate={selectedDate}
                                />
                            </div>
                        </div>
                    )}

                    <div className={`space-y-6 ${viewMode === 'calendar' ? 'lg:col-span-2' : ''}`}>
                        {viewMode === 'calendar' ? (
                            <div className="card min-h-[500px]">
                                <h3 className="text-lg font-bold text-secondary-900 mb-6 border-b border-secondary-100 pb-4">
                                    Appointments for <span className="text-primary-600">{selectedDate}</span>
                                </h3>
                                
                                {filteredForDate.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredForDate.map(app => (
                                            <div key={app._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-secondary-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-blue-50 text-blue-700 font-bold px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-blue-100">
                                                        {app.timeSlot}
                                                    </div>
                                                    <div>
                                                        <strong className="block text-secondary-900 font-semibold text-lg">
                                                            {user.user?.role === 'patient' ? app.doctorName : app.patientName}
                                                        </strong>
                                                        <p className="text-sm text-secondary-500 mt-1">
                                                            <span className="font-medium text-secondary-700">{app.department}</span> • {app.reason || 'No reason provided'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                        ${app.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : ''}
                                                        ${app.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                                                        ${app.status === 'cancelled' || app.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                                                        ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                        ${app.status === 'approved' ? 'bg-teal-100 text-teal-700' : ''}
                                                    `}>
                                                        {app.status}
                                                    </span>

                                                    {/* Actions */}
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        {user.user?.role === 'patient' && (app.status === 'pending' || app.status === 'approved') && (
                                                            <>
                                                                <button className="flex-1 sm:flex-none btn text-xs py-1.5 px-3 border border-secondary-300 hover:bg-secondary-50 text-secondary-700" onClick={() => openReschedule(app)}>Reschedule</button>
                                                                <button className="flex-1 sm:flex-none btn text-xs py-1.5 px-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" onClick={() => handleCancel(app._id)}>Cancel</button>
                                                            </>
                                                        )}

                                                        {user.user?.role === 'doctor' && (
                                                            <>
                                                                {app.status === 'pending' && (
                                                                    <>
                                                                        <button className="btn text-xs py-1.5 px-3 bg-green-600 text-white hover:bg-green-700 shadow-sm" onClick={() => handleStatusUpdate(app._id, 'approved')}>Approve</button>
                                                                        <button className="btn text-xs py-1.5 px-3 border border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleStatusUpdate(app._id, 'rejected')}>Reject</button>
                                                                    </>
                                                                )}
                                                                {app.status === 'approved' && (
                                                                    <button className="btn text-xs py-1.5 px-3 bg-primary-600 text-white hover:bg-primary-700 shadow-sm" onClick={() => openTreatmentModal(app)}>Treat Patient</button>
                                                                )}
                                                                {(app.status === 'completed' || app.treatment) && (
                                                                    <button className="btn text-xs py-1.5 px-3 border border-secondary-300 text-secondary-700 hover:bg-secondary-50" onClick={() => openTreatmentModal(app)}>View Details</button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-secondary-400">
                                        <div className="text-4xl mb-4">📅</div>
                                        <p>No appointments scheduled for this date.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                             // List View
                            <div className="card overflow-hidden">
                                <h3 className="text-lg font-bold text-secondary-900 mb-6 px-6 pt-6">Full Appointment History</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-secondary-50 border-b border-secondary-200">
                                            <tr>
                                                <th className="px-6 py-4 text-sm font-semibold text-secondary-600 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-secondary-600 uppercase tracking-wider">Time</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-secondary-600 uppercase tracking-wider">{user.user?.role === 'patient' ? 'Doctor' : 'Patient'}</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-secondary-600 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-secondary-100">
                                            {appointments.sort((a, b) => new Date(a.date) - new Date(b.date)).map(app => (
                                                <tr key={app._id} className="hover:bg-secondary-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-secondary-900 font-medium">{app.date}</td>
                                                    <td className="px-6 py-4 text-secondary-700">{app.timeSlot}</td>
                                                    <td className="px-6 py-4 text-secondary-900">{user.user?.role === 'patient' ? app.doctorName : app.patientName}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                                            ${app.status === 'upcoming' ? 'bg-blue-50 text-blue-700' : ''}
                                                            ${app.status === 'completed' ? 'bg-green-50 text-green-700' : ''}
                                                            ${app.status === 'cancelled' || app.status === 'rejected' ? 'bg-red-50 text-red-700' : ''}
                                                            ${app.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : ''}
                                                            ${app.status === 'approved' ? 'bg-teal-50 text-teal-700' : ''}
                                                        `}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-secondary-900 mb-4">Reschedule Appointment</h2>
                            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">New Date</label>
                                    <input type="date" className="input-field" value={rescheduleData.date} onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">New Time Slot</label>
                                    <select className="input-field" value={rescheduleData.timeSlot} onChange={e => setRescheduleData({ ...rescheduleData, timeSlot: e.target.value })} required>
                                        <option value="">Select Time</option>
                                        {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'].map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="submit" className="flex-1 btn btn-primary">Confirm Reschedule</button>
                                    <button type="button" className="flex-1 btn btn-outline" onClick={() => setShowRescheduleModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Treatment Modal */}
            {showTreatmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6 border-b border-secondary-100 pb-4">
                                <h3 className="text-xl font-bold text-secondary-900">Consultation Report</h3>
                                <button onClick={() => setShowTreatmentModal(false)} className="text-secondary-400 hover:text-secondary-600 text-2xl leading-none">&times;</button>
                            </div>
                            
                            <div className="mb-6 bg-secondary-50 p-3 rounded-lg text-sm border border-secondary-100">
                                <p><span className="font-semibold text-secondary-700">Patient:</span> {selectedApp.patientName}</p>
                                <p><span className="font-semibold text-secondary-700">Reason:</span> {selectedApp.reason || 'Checkup'}</p>
                            </div>

                            <form onSubmit={handleTreatmentSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Treatment Given</label>
                                    <textarea
                                        required
                                        className="input-field min-h-[80px]"
                                        placeholder="Describe the treatment..."
                                        value={treatmentData.treatment}
                                        onChange={e => setTreatmentData({ ...treatmentData, treatment: e.target.value })}
                                        disabled={selectedApp.status === 'completed'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Prescription</label>
                                    <textarea
                                        required
                                        className="input-field min-h-[80px]"
                                        placeholder="List medicines here..."
                                        value={treatmentData.prescription}
                                        onChange={e => setTreatmentData({ ...treatmentData, prescription: e.target.value })}
                                        disabled={selectedApp.status === 'completed'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Additional Notes</label>
                                    <textarea
                                        className="input-field min-h-[80px]"
                                        placeholder="Follow-up instructions etc."
                                        value={treatmentData.notes}
                                        onChange={e => setTreatmentData({ ...treatmentData, notes: e.target.value })}
                                        disabled={selectedApp.status === 'completed'}
                                    />
                                </div>
                                {selectedApp.status !== 'completed' && (
                                    <button className="w-full btn btn-primary mt-4">
                                        Save & Complete Consultation
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchedulePage;
