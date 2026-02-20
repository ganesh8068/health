import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CalendarView from '../components/CalendarView';
import { fetchAppointments, updateAppointment, rescheduleAppointment, deleteAppointment, updateTreatment } from '../services/api';

const SchedulePage = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [appointments, setAppointments] = useState([]);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Modal states
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showTreatmentModal, setShowTreatmentModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [treatmentInput, setTreatmentInput] = useState('');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const res = await fetchAppointments();
            setAppointments(res.data);
        } catch (error) {
            console.error("Error loading appointments", error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await updateAppointment(id, status);
            setAppointments(appointments.map(app => app._id === id ? res.data : app));
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await deleteAppointment(id);
            setAppointments(appointments.filter(app => app._id !== id));
        } catch (error) {
            console.error("Error deleting appointment", error);
        }
    };

    const openReschedule = (app) => {
        setSelectedAppointment(app);
        setNewDate(app.date.split('T')[0]);
        setNewTime(app.time);
        setShowRescheduleModal(true);
    };

    const handleReschedule = async () => {
        try {
            const res = await rescheduleAppointment(selectedAppointment._id, { date: newDate, time: newTime });
            setAppointments(appointments.map(app => app._id === selectedAppointment._id ? res.data : app));
            setShowRescheduleModal(false);
        } catch (error) {
            console.error("Error rescheduling", error);
        }
    };

    const openTreatment = (app) => {
        setSelectedAppointment(app);
        setTreatmentInput(app.treatment || '');
        setShowTreatmentModal(true);
    };

    const handleTreatmentUpdate = async () => {
        try {
            const res = await updateTreatment(selectedAppointment._id, { treatment: treatmentInput });
            setAppointments(appointments.map(app => app._id === selectedAppointment._id ? res.data : app));
            setShowTreatmentModal(false);
        } catch (error) {
            console.error("Error updating treatment", error);
        }
    };

    const filteredAppointments = appointments.filter(app => {
        if (viewMode === 'calendar') {
            // In calendar mode, list appointments for selected date
            return app.date.startsWith(selectedDate);
        }
        return true; // Show all in list view (could be paginated)
    });

    return (
        <div className="min-h-screen bg-surface-muted">
            <Navbar user={user} setUser={setUser} />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-secondary-900">Schedule</h1>
                        <p className="text-secondary-500">Manage your appointments</p>
                    </div>
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-secondary-200 flex">
                        <button 
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'calendar' ? 'bg-primary text-white shadow-sm' : 'text-secondary-600 hover:bg-secondary-50'}`} 
                            onClick={() => setViewMode('calendar')}
                        >
                            Calendar View
                        </button>
                        <button 
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-secondary-600 hover:bg-secondary-50'}`} 
                            onClick={() => setViewMode('list')}
                        >
                            List View
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Sidebar (Only in Calendar Mode) */}
                    {viewMode === 'calendar' && (
                        <div className="lg:col-span-1">
                            <CalendarView 
                                appointments={appointments} 
                                onDateSelect={setSelectedDate} 
                                selectedDate={selectedDate} 
                            />
                        </div>
                    )}

                    {/* Appointment List */}
                    <div className={viewMode === 'calendar' ? 'lg:col-span-2' : 'col-span-3'}>
                         <div className="space-y-4">
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map(app => (
                                    <div key={app._id} className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-secondary-900">{app.doctorName || 'Doctor'} - {app.patientName}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                                    ${app.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                                    app.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                                    'bg-orange-100 text-orange-700'}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-secondary-600 mb-4 flex items-center gap-4">
                                                <span className="flex items-center gap-1">📅 {new Date(app.date).toDateString()}</span>
                                                <span className="flex items-center gap-1">⏰ {app.time}</span>
                                            </div>
                                            
                                            {app.treatment && (
                                                <div className="bg-secondary-50 p-3 rounded-lg text-sm text-secondary-700 mb-4">
                                                    <span className="font-semibold block mb-1">Treatment Plan:</span>
                                                    {app.treatment}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {app.status !== 'Completed' && app.status !== 'Cancelled' && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(app._id, 'Completed')} className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors">
                                                            Mark Complete
                                                        </button>
                                                        <button onClick={() => openReschedule(app)} className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
                                                            Reschedule
                                                        </button>
                                                        <button onClick={() => handleDelete(app._id)} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => openTreatment(app)} className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors">
                                                    {app.treatment ? 'Update Treatment' : 'Add Treatment'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border border-secondary-100">
                                    <p className="text-secondary-400 font-medium">No appointments found for {viewMode === 'calendar' ? 'this date' : 'now'}.</p>
                                    <a href="/book" className="text-primary-600 font-semibold hover:underline mt-2 inline-block">Book a new appointment</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reschedule Modal */}
                {showRescheduleModal && (
                    <div className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
                            <h3 className="text-xl font-bold text-secondary-900 mb-4">Reschedule Appointment</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">New Date</label>
                                    <input type="date" className="input-field" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">New Time</label>
                                    <input type="time" className="input-field" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                                </div>
                                <div className="flex gap-3 justify-end mt-6">
                                    <button onClick={() => setShowRescheduleModal(false)} className="px-4 py-2 text-secondary-600 font-medium hover:bg-secondary-50 rounded-lg">Cancel</button>
                                    <button onClick={handleReschedule} className="btn btn-primary">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Treatment Modal */}
                {showTreatmentModal && (
                    <div className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
                            <h3 className="text-xl font-bold text-secondary-900 mb-4">Update Treatment Plan</h3>
                            <textarea 
                                className="input-field min-h-[150px]" 
                                placeholder="Enter diagnosis, prescription, or notes..."
                                value={treatmentInput}
                                onChange={(e) => setTreatmentInput(e.target.value)}
                            ></textarea>
                            <div className="flex gap-3 justify-end mt-6">
                                <button onClick={() => setShowTreatmentModal(false)} className="px-4 py-2 text-secondary-600 font-medium hover:bg-secondary-50 rounded-lg">Cancel</button>
                                <button onClick={handleTreatmentUpdate} className="btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchedulePage;
