import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { fetchDoctors, bookAppointment } from '../services/api';

const BookingPage = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [step, setStep] = useState(1);
    const [specialization, setSpecialization] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const navigate = useNavigate();

    const specializations = ['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic'];

    const handleSpecializationSelect = async (spec) => {
        setSpecialization(spec);
        try {
            const res = await fetchDoctors(spec);
            setDoctors(res.data);
            setStep(2);
        } catch (error) {
            console.error("Error fetching doctors", error);
        }
    };

    const handleBooking = async () => {
        try {
            await bookAppointment({
                doctorId: selectedDoctor._id,
                doctorName: selectedDoctor.name,
                // backend expects 'department' and 'timeSlot'
                department: specialization,
                date,
                timeSlot: time,
                // patient info is derived from token on backend (req.user)
            });
            alert('Appointment Booked Successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error("Error booking appointment", error);
            alert('Booking Failed');
        }
    };

    return (
        <div className="min-h-screen bg-surface-muted">
            <Navbar user={user} setUser={setUser} />
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary-600 p-8 text-center">
                        <h1 className="text-3xl font-display font-bold text-white mb-2">Book Appointment</h1>
                        <p className="text-primary-100">Follow the steps to schedule your visit</p>
                    </div>

                    {/* Stepper */}
                    <div className="flex border-b border-secondary-100">
                        <div className={`flex-1 py-4 text-center text-sm font-semibold ${step >= 1 ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-400'}`}>1. Specialist</div>
                        <div className={`flex-1 py-4 text-center text-sm font-semibold ${step >= 2 ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-400'}`}>2. Doctor</div>
                        <div className={`flex-1 py-4 text-center text-sm font-semibold ${step >= 3 ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-400'}`}>3. Time</div>
                        <div className={`flex-1 py-4 text-center text-sm font-semibold ${step >= 4 ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-400'}`}>4. Confirm</div>
                    </div>

                    <div className="p-8">
                        {step === 1 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                {specializations.map(spec => (
                                    <button 
                                        key={spec} 
                                        onClick={() => handleSpecializationSelect(spec)}
                                        className="p-4 rounded-xl border border-secondary-200 text-secondary-700 font-medium hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all text-left flex justify-between items-center group"
                                    >
                                        {spec}
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-600">→</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-secondary-900 mb-4">Select a {specialization}</h3>
                                {doctors.length > 0 ? (
                                    doctors.map(doc => (
                                        <div 
                                            key={doc._id} 
                                            onClick={() => { setSelectedDoctor(doc); setStep(3); }}
                                            className="p-4 rounded-xl border border-secondary-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all flex items-center gap-4"
                                        >
                                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl">
                                                {doc.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-secondary-900">{doc.name}</h4>
                                                <p className="text-sm text-secondary-500">Available Today</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-secondary-500">
                                        No doctors available for this specialization.
                                        <button onClick={() => setStep(1)} className="block mx-auto mt-4 text-primary-600 hover:underline">Go back</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Select Date</label>
                                    <input 
                                        type="date" 
                                        className="input-field" 
                                        onChange={(e) => setDate(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Select Time</label>
                                    <input 
                                        type="time" 
                                        className="input-field" 
                                        onChange={(e) => setTime(e.target.value)} 
                                    />
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button onClick={() => setStep(2)} className="text-secondary-500 hover:text-secondary-900 font-medium">Back</button>
                                    <button 
                                        onClick={() => setStep(4)} 
                                        disabled={!date || !time}
                                        className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">📋</span>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-secondary-900">Confirm Appointment</h3>
                                
                                <div className="bg-secondary-50 rounded-xl p-6 text-left space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-secondary-500">Doctor</span>
                                        <span className="font-semibold text-secondary-900">{selectedDoctor?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-secondary-500">Specialization</span>
                                        <span className="font-semibold text-secondary-900">{specialization}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-secondary-500">Date</span>
                                        <span className="font-semibold text-secondary-900">{date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-secondary-500">Time</span>
                                        <span className="font-semibold text-secondary-900">{time}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4 gap-4">
                                    <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl border border-secondary-200 font-semibold text-secondary-700 hover:bg-secondary-50">Back</button>
                                    <button 
                                        onClick={handleBooking} 
                                        className="flex-1 btn btn-primary py-3 shadow-lg shadow-primary-500/30"
                                    >
                                        Confirm Booking
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
