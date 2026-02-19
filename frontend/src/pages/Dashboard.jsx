import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { fetchAppointments, bookAppointment, updateAppointment, deleteAppointment, fetchDoctors } from '../services/api';

const Dashboard = ({ user, setUser }) => {
    // ... [state and logic remain same] ...
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [bookingData, setBookingData] = useState({ department: '', doctorName: '', doctorId: '', patientName: user.user.name, date: '', timeSlot: '', reason: '' });

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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            await deleteAppointment(id);
            loadAppointments();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const isAdmin = user.user.role === 'admin' || user.user.email === 'kartikchoudhary@gmail.com';

    return (
        <div>
            <Navbar user={user} setUser={setUser} />

            <div className="container" style={{ padding: '0 0 2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: user.user.role === 'patient' ? '1fr 2fr' : '1fr', gap: '2rem' }}>
                    {user.user.role === 'patient' && (
                        <div className="card" style={{ borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Book Appointment</h3>
                            <form onSubmit={handleBooking}>
                                {/* Form fields remain same */}
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
                                    <input required type="date" onChange={e => setBookingData({ ...bookingData, date: e.target.value })} style={{ borderRadius: '12px', padding: '0.8rem' }} />
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

                    <div className="card" style={{ borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>{isAdmin ? 'System Registry' : 'My Appointments'}</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '0.75rem' }}>Specialist / Patient</th>
                                        <th>Department</th>
                                        <th>Schedule</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(app => (
                                        <tr key={app._id} style={{ background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                                            <td style={{ padding: '1rem', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                                                <div style={{ fontWeight: '600' }}>{user.user.role === 'patient' ? app.doctorName : app.patientName}</div>
                                                {(isAdmin || user.user.role === 'doctor') && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.patientEmail}</div>}
                                            </td>
                                            <td style={{ padding: '1rem' }}>{app.department}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.9rem' }}>{app.date}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.timeSlot}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '50px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    background: app.status === 'approved' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : app.status === 'completed' ? '#dbeafe' : '#fef3c7',
                                                    color: app.status === 'approved' ? '#166534' : app.status === 'rejected' ? '#991b1b' : app.status === 'completed' ? '#1e40af' : '#92400e'
                                                }}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {(user.user.role === 'doctor' || isAdmin) && app.status === 'pending' && (
                                                        <>
                                                            <button className="btn" style={{ background: 'var(--success)', color: 'white', padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '50px' }} onClick={() => handleStatusUpdate(app._id, 'approved')}>✓</button>
                                                            <button className="btn" style={{ background: 'var(--error)', color: 'white', padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '50px' }} onClick={() => handleStatusUpdate(app._id, 'rejected')}>✕</button>
                                                        </>
                                                    )}
                                                    {(user.user.role === 'doctor' || isAdmin) && app.status === 'approved' && (
                                                        <button className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '50px' }} onClick={() => handleStatusUpdate(app._id, 'completed')}>Finish</button>
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
                            {appointments.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No appointments yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
