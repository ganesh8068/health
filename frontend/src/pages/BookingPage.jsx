import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CalendarView from '../components/CalendarView';
// import { fetchDoctors, bookAppointment, fetchAppointments } from '../services/api';

const BookingPage = ({ user, setUser }) => {
    const [step, setStep] = useState(1);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [bookingData, setBookingData] = useState({ department: '', doctorName: '', doctorId: '', patientName: user?.user?.name, date: '', timeSlot: '', reason: '' });

    useEffect(() => {
        // Mock data
        setAppointments([
             { _id: '1', date: '2023-10-25', timeSlot: '10:00 AM', status: 'pending' },
        ]);
        /*
        const loadInitialData = async () => {
             const { data } = await fetchAppointments();
             setAppointments(data);
        };
        loadInitialData();
        */
    }, []);

    const handleDepartmentSelect = async (dept) => {
        setBookingData({ ...bookingData, department: dept, doctorName: '', doctorId: '' });
        
        // Mock Logic
        setDoctors([
            { _id: 'd1', name: 'Dr. Smith', specialization: dept },
            { _id: 'd2', name: 'Dr. Johnson', specialization: dept },
        ]);
        setStep(2);
        
        /*
        try {
            const deptMap = { ... };
            const specialization = deptMap[dept] || dept;
            const { data } = await fetchDoctors(specialization);
            setDoctors(data);
            setStep(2);
        } catch (err) {
            alert("Failed to load doctors");
        }
        */
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
        alert("Appointment Booked (Simulated)");
        // await bookAppointment(bookingData);
        window.location.href = '/dashboard';
    };

    const steps = [
        { num: 1, label: 'Specialist' },
        { num: 2, label: 'Doctor' },
        { num: 3, label: 'Date' },
        { num: 4, label: 'Confirm' }
    ];

    return (
        <div className="min-h-screen bg-secondary-50 pb-12">
            <Navbar user={user} setUser={setUser} />
            <div className="container mx-auto px-4 max-w-4xl">
                
                {/* Stepper */}
                <div className="mb-10">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary-200 -z-10 rounded-full"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                        
                        {steps.map((s) => (
                            <div key={s.num} className="flex flex-col items-center gap-2 bg-secondary-50 px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                                    ${step >= s.num ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-4 ring-primary-50' : 'bg-secondary-200 text-secondary-500'}
                                `}>
                                    {s.num}
                                </div>
                                <span className={`text-xs font-semibold ${step >= s.num ? 'text-primary-700' : 'text-secondary-400'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">Select Department</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Gynecology', 'General Medicine'].map(dept => (
                                    <button 
                                        key={dept} 
                                        className="p-6 rounded-xl border border-secondary-200 hover:border-primary-500 hover:shadow-md hover:bg-primary-50/20 transition-all text-secondary-700 hover:text-primary-700 font-semibold text-center flex flex-col items-center gap-2 group"
                                        onClick={() => handleDepartmentSelect(dept)}
                                    >
                                        <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-xl group-hover:bg-primary-100 group-hover:scale-110 transition-transform">
                                            🏥
                                        </div>
                                        {dept}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                             <div className="flex items-center gap-4 mb-6">
                                <button className="text-secondary-400 hover:text-secondary-600" onClick={() => setStep(1)}>← Back</button>
                                <h2 className="text-2xl font-bold text-secondary-900">Choose a Doctor</h2>
                            </div>
                            
                            {doctors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {doctors.map(doc => (
                                        <button key={doc._id} className="p-4 rounded-xl border border-secondary-200 hover:border-primary-500 hover:shadow-md text-left flex items-center gap-4 transition-all group" onClick={() => handleDoctorSelect(doc)}>
                                            <div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center text-2xl group-hover:bg-primary-100">👨‍⚕️</div>
                                            <div>
                                                <strong className="block text-lg text-secondary-900 group-hover:text-primary-700">{doc.name}</strong>
                                                <p className="text-sm text-secondary-500">{doc.specialization}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : <p className="text-center text-secondary-500 py-8">No doctors available in this department.</p>}
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <button className="text-secondary-400 hover:text-secondary-600" onClick={() => setStep(2)}>← Back</button>
                                <h2 className="text-2xl font-bold text-secondary-900">Select Date</h2>
                            </div>
                            <div className="max-w-md mx-auto">
                                <CalendarView
                                    appointments={appointments}
                                    onDateSelect={handleDateSelect}
                                    selectedDate={bookingData.date}
                                />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <button className="text-secondary-400 hover:text-secondary-600" onClick={() => setStep(3)}>← Back</button>
                                <h2 className="text-2xl font-bold text-secondary-900">Confirm Appointment</h2>
                            </div>
                            
                            <div className="bg-secondary-50 rounded-xl p-6 mb-6 border border-secondary-100">
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-secondary-200 pb-2">
                                        <span className="text-secondary-500">Specialist</span>
                                        <span className="font-semibold text-secondary-900">{bookingData.department}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-secondary-200 pb-2">
                                        <span className="text-secondary-500">Doctor</span>
                                        <span className="font-semibold text-secondary-900">{bookingData.doctorName}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-secondary-200 pb-2">
                                        <span className="text-secondary-500">Date</span>
                                        <span className="font-semibold text-secondary-900">{bookingData.date}</span>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                     <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Time Slot</label>
                                        <select className="input-field" required value={bookingData.timeSlot} onChange={e => setBookingData({ ...bookingData, timeSlot: e.target.value })}>
                                            <option value="">Select Time</option>
                                            {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'].map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Reason for visit (optional)</label>
                                        <input type="text" className="input-field" placeholder="Regular checkup..." onChange={e => setBookingData({ ...bookingData, reason: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full btn btn-primary py-3 text-lg shadow-lg" onClick={handleConfirm} disabled={!bookingData.timeSlot}>
                                Confirm & Book Appointment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
