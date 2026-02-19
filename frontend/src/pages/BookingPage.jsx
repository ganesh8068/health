import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CalendarView from '../components/CalendarView';
import { fetchDoctors, bookAppointment, fetchAppointments } from '../services/api';

const BookingPage = ({ user, setUser }) => {
    const [step, setStep] = useState(1);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [bookingData, setBookingData] = useState({ department: '', doctorName: '', doctorId: '', patientName: user.user.name, date: '', timeSlot: '', reason: '' });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const { data } = await fetchAppointments();
                setAppointments(data);
            } catch (err) {
                console.error("Failed to load appointments");
            }
        };
        loadInitialData();
    }, []);

    const handleDepartmentSelect = async (dept) => {
        setBookingData({ ...bookingData, department: dept, doctorName: '', doctorId: '' });
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
            setStep(2);
        } catch (err) {
            alert("Failed to load doctors");
        }
    };

    const handleDoctorSelect = (doc) => {
        setBookingData({ ...bookingData, doctorId: doc._id, doctorName: doc.name });
        setStep(3);
    };

    const handleDateSelect = (date) => {
        setBookingData({ ...bookingData, date: date });
        setStep(4);
    };

    const handleConfirm = async () => {
        try {
            await bookAppointment(bookingData);
            alert("Appointment Booked Successfully!");
            window.location.href = '/dashboard';
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        }
    };

    return (
        <div className="booking-page">
            <Navbar user={user} setUser={setUser} />
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="booking-stepper">
                    <div className={`step-item ${step >= 1 ? 'active' : ''}`}>1. Specialist</div>
                    <div className={`step-item ${step >= 2 ? 'active' : ''}`}>2. Doctor</div>
                    <div className={`step-item ${step >= 3 ? 'active' : ''}`}>3. Date</div>
                    <div className={`step-item ${step >= 4 ? 'active' : ''}`}>4. Time & Confirm</div>
                </div>

                <div className="card booking-card">
                    {step === 1 && (
                        <div className="step-content">
                            <h2>Select Department</h2>
                            <div className="selection-grid">
                                {['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Gynecology', 'General Medicine'].map(dept => (
                                    <button key={dept} className="selection-btn" onClick={() => handleDepartmentSelect(dept)}>{dept}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-content">
                            <h2>Choose a Doctor ({bookingData.department})</h2>
                            {doctors.length > 0 ? (
                                <div className="selection-grid">
                                    {doctors.map(doc => (
                                        <button key={doc._id} className="selection-btn" onClick={() => handleDoctorSelect(doc)}>
                                            <strong>{doc.name}</strong>
                                            <p>{doc.specialization}</p>
                                        </button>
                                    ))}
                                </div>
                            ) : <p>No doctors available in this department.</p>}
                            <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-content">
                            <h2>Select preferred Date</h2>
                            <div className="calendar-container">
                                <CalendarView
                                    appointments={appointments}
                                    onDateSelect={handleDateSelect}
                                    selectedDate={bookingData.date}
                                />
                            </div>
                            <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="step-content">
                            <h2>Confirm Appointment</h2>
                            <div className="review-box">
                                <p><strong>Specialist:</strong> {bookingData.department}</p>
                                <p><strong>Doctor:</strong> {bookingData.doctorName}</p>
                                <p><strong>Date:</strong> {bookingData.date}</p>

                                <div className="form-group" style={{ marginTop: '1rem' }}>
                                    <label>Select Time Slot</label>
                                    <select required value={bookingData.timeSlot} onChange={e => setBookingData({ ...bookingData, timeSlot: e.target.value })}>
                                        <option value="">Select Time</option>
                                        {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'].map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Reason for visit (optional)</label>
                                    <input type="text" placeholder="Regular checkup..." onChange={e => setBookingData({ ...bookingData, reason: e.target.value })} />
                                </div>
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleConfirm} disabled={!bookingData.timeSlot}>Confirm & Book</button>
                            <button className="btn-back" onClick={() => setStep(3)}>← Back</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
