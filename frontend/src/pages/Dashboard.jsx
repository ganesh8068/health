import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CalendarView from '../components/CalendarView';
import { fetchAppointments, bookAppointment, updateAppointment, updateTreatment, deleteAppointment, fetchDoctors } from '../services/api';

const Dashboard = ({ user, setUser }) => {
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'history'
    const [doctors, setDoctors] = useState([]);
    const [bookingData, setBookingData] = useState({ department: '', doctorName: '', doctorId: '', patientName: user.user.name, date: '', timeSlot: '', reason: '' });

    // Treatment Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [treatmentData, setTreatmentData] = useState({ treatment: '', prescription: '', notes: '' });

    const loadAppointments = async () => {
        try {
            const { data } = await fetchAppointments();
            setAppointments(data);
        } catch (err) {
            console.error('Failed to fetch appointments');
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const handleDateSelect = (date) => {
        setBookingData({ ...bookingData, date: date });
    };

    const handleDepartmentChange = async (e) => {
        const dept = e.target.value;
        setBookingData({ ...bookingData, department: dept, doctorName: '', doctorId: '' });
        if (dept) {
            try {
                const deptMap = {
                    'Cardiology': 'Cardiologist',
                    'Dermatology': 'Dermatologist',
                    'Neurology': 'Neurologist',
                    'Orthopedics': 'Orthopedic Surgeon',
                    'Pediatrics': 'Pediatrician',
                    'Gynecology': 'Gynecologist',
                    'General Medicine': 'General Physician'
                };
                const specialization = deptMap[dept] || dept;
                const { data } = await fetchDoctors(specialization);
                setDoctors(data);
            } catch (err) {
                console.error("Failed to load doctors");
            }
        } else {
            setDoctors([]);
        }
    };

    const handleDoctorSelect = (e) => {
        const selectedDoctorId = e.target.value;
        const selectedDoctor = doctors.find(d => d._id === selectedDoctorId);
        if (selectedDoctor) {
            setBookingData({ ...bookingData, doctorId: selectedDoctor._id, doctorName: selectedDoctor.name });
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            await bookAppointment(bookingData);
            alert('Appointment booked successfully');
            loadAppointments();
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateAppointment(id, status);
            loadAppointments();
        } catch (err) {
            alert('Update failed');
        }
    };

    const handleTreatmentSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTreatment(selectedApp._id, treatmentData);
            alert('Treatment updated successfully');
            setShowModal(false);
            loadAppointments();
        } catch (err) {
            alert('Failed to update treatment');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            await deleteAppointment(id);
            loadAppointments();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const openTreatmentModal = (app) => {
        setSelectedApp(app);
        setTreatmentData({ treatment: app.treatment || '', prescription: app.prescription || '', notes: app.notes || '' });
        setShowModal(true);
    };

    const isAdmin = user.user.role === 'admin' || user.user.email === 'kartikchoudhary@gmail.com';

    const filteredAppointments = appointments.filter(app => {
        if (activeTab === 'upcoming') return app.status !== 'completed' && app.status !== 'rejected';
        return app.status === 'completed' || app.status === 'rejected';
    });

    return (
        <div>
            <Navbar user={user} setUser={setUser} />

            <div className="container" style={{ padding: '0 0 2rem 0', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Dashboard Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>Welcome, {user.user.name} 👋</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your health journey with MediCore Pro</p>
                    </div>
                    {(user.user.role === 'doctor' || user.user.role === 'admin') && (
                        <div style={{ background: 'white', padding: '0.5rem', borderRadius: '50px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', gap: '5px' }}>
                            <button className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>Active</button>
                            <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button>
                        </div>
                    )}
                    {user.user.role === 'patient' && (
                        <div style={{ background: 'white', padding: '0.5rem', borderRadius: '50px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', gap: '5px' }}>
                            <button className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>My Schedule</button>
                            <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Past Visits</button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'upcoming' ? '1fr 2fr' : '1fr', gap: '2rem' }}>

                    {/* Left Sidebar: Booking or Statistics */}
                    {activeTab === 'upcoming' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Calendar View */}
                            <div className="card" style={{ borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Calendar Overview</h3>
                                <CalendarView
                                    appointments={appointments}
                                    onDateSelect={handleDateSelect}
                                    selectedDate={bookingData.date}
                                />
                            </div>

                            {user.user.role === 'patient' && (
                                <div className="card" style={{ borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Book Appointment</h3>
                                    <form onSubmit={handleBooking}>
                                        <div className="form-group">
                                            <label>Department</label>
                                            <select required onChange={handleDepartmentChange} style={{ borderRadius: '12px', padding: '0.8rem' }}>
                                                <option value="">Select Department</option>
                                                <option value="Cardiology">Cardiology</option>
                                                <option value="Dermatology">Dermatology</option>
                                                <option value="Neurology">Neurology</option>
                                                <option value="Orthopedics">Orthopedics</option>
                                                <option value="Pediatrics">Pediatrics</option>
                                                <option value="Gynecology">Gynecology</option>
                                                <option value="General Medicine">General Medicine</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Specialist</label>
                                            <select required onChange={handleDoctorSelect} disabled={!doctors.length} style={{ borderRadius: '12px', padding: '0.8rem' }}>
                                                <option value="">{doctors.length ? 'Select Doctor' : 'First Select Department'}</option>
                                                {doctors.map(doc => (
                                                    <option key={doc._id} value={doc._id}>{doc.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Date</label>
                                            <input
                                                required
                                                type="date"
                                                value={bookingData.date}
                                                onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                                                style={{ borderRadius: '12px', padding: '0.8rem' }}
                                            />
                                            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '5px' }}>Tip: You can also select a date from the calendar!</small>
                                        </div>
                                        <div className="form-group">
                                            <label>Time Slot</label>
                                            <select required onChange={e => setBookingData({ ...bookingData, timeSlot: e.target.value })} style={{ borderRadius: '12px', padding: '0.8rem' }}>
                                                <option value="">Select Time</option>
                                                <option value="09:00 AM">09:00 AM</option>
                                                <option value="10:00 AM">10:00 AM</option>
                                                <option value="11:00 AM">11:00 AM</option>
                                                <option value="02:00 PM">02:00 PM</option>
                                                <option value="04:00 PM">04:00 PM</option>
                                                <option value="06:00 PM">06:00 PM</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Reason</label>
                                            <input placeholder="Checkup..." onChange={e => setBookingData({ ...bookingData, reason: e.target.value })} style={{ borderRadius: '12px', padding: '0.8rem' }} />
                                        </div>
                                        <button className="btn btn-primary" style={{ width: '100%', borderRadius: '50px', padding: '1rem', marginTop: '1rem' }}>Book Appointment</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="card" style={{ borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>{activeTab === 'upcoming' ? 'Current Appointments' : 'History & Records'}</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '0.75rem' }}>{user.user.role === 'patient' ? 'Doctor' : 'Patient'}</th>
                                        <th>Department</th>
                                        <th>Schedule</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.map(app => (
                                        <tr key={app._id} style={{ background: '#fff', borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '1.2rem 1rem' }}>
                                                <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.user.role === 'patient' ? app.doctorName : app.patientName}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.reason || 'Regular checkup'}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>{app.department}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{app.date}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.timeSlot}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className={`badge bg-${app.status}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {(user.user.role === 'doctor' || isAdmin) && app.status === 'pending' && (
                                                        <>
                                                            <button className="btn" style={{ background: 'var(--success)', color: 'white', padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '50px' }} onClick={() => handleStatusUpdate(app._id, 'approved')}>Approve</button>
                                                            <button className="btn" style={{ background: 'var(--error)', color: 'white', padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '50px' }} onClick={() => handleStatusUpdate(app._id, 'rejected')}>Reject</button>
                                                        </>
                                                    )}
                                                    {(user.user.role === 'doctor' || isAdmin) && app.status === 'approved' && (
                                                        <button className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '50px' }} onClick={() => openTreatmentModal(app)}>Treat Patient</button>
                                                    )}
                                                    {activeTab === 'history' && app.treatment && (
                                                        <button className="btn" style={{ background: '#f1f5f9', color: '#475569', padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '50px' }} onClick={() => { setSelectedApp(app); setShowModal(true); setTreatmentData({ treatment: app.treatment, prescription: app.prescription, notes: app.notes }); }}>View Details</button>
                                                    )}
                                                    {isAdmin && (
                                                        <button className="btn" style={{ background: '#333', color: 'white', padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '50px' }} onClick={() => handleDelete(app._id)}>Del</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredAppointments.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No records found in this section.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Treatment Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Consultation Report</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Patient: <strong>{selectedApp.patientName}</strong> | Date: {selectedApp.date}</p>

                        <form onSubmit={handleTreatmentSubmit}>
                            <div className="form-group">
                                <label>Treatment Given</label>
                                <textarea
                                    required
                                    placeholder="Describe the treatment..."
                                    value={treatmentData.treatment}
                                    onChange={e => setTreatmentData({ ...treatmentData, treatment: e.target.value })}
                                    disabled={activeTab === 'history'}
                                />
                            </div>
                            <div className="form-group">
                                <label>Prescription (Medicines)</label>
                                <textarea
                                    required
                                    placeholder="List medicines here..."
                                    value={treatmentData.prescription}
                                    onChange={e => setTreatmentData({ ...treatmentData, prescription: e.target.value })}
                                    disabled={activeTab === 'history'}
                                />
                            </div>
                            <div className="form-group">
                                <label>Additional Notes</label>
                                <textarea
                                    placeholder="Follow-up instructions etc."
                                    value={treatmentData.notes}
                                    onChange={e => setTreatmentData({ ...treatmentData, notes: e.target.value })}
                                    disabled={activeTab === 'history'}
                                />
                            </div>
                            {activeTab === 'upcoming' && (
                                <button className="btn btn-primary" style={{ width: '100%', borderRadius: '50px', padding: '0.8rem' }}>Save & Complete Consultation</button>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
