import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [specialization, setSpecialization] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Real API call
            await register({ name, email, password, role, specialization: role === 'doctor' ? specialization : undefined });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-secondary-50">
            <div className="card w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-none">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-secondary-900">Create Account</h2>
                    <p className="text-secondary-500 mt-2">Join us to manage your health journey</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Role</label>
                        <div className="flex gap-4 items-center">
                            <label className="inline-flex items-center">
                                <input type="radio" name="role" value="patient" checked={role === 'patient'} onChange={() => setRole('patient')} className="mr-2" />
                                <span className="text-sm">Patient</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="role" value="doctor" checked={role === 'doctor'} onChange={() => setRole('doctor')} className="mr-2" />
                                <span className="text-sm">Doctor</span>
                            </label>
                        </div>
                        {role === 'doctor' && (
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Specialization (optional)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Cardiology"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                />
                                <p className="text-xs text-secondary-500 mt-1">Doctors must register with an @medcore.in email address.</p>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="w-full btn btn-primary py-3 text-lg shadow-lg shadow-primary-500/30">
                        Create Account
                    </button>
                    
                    <p className="text-center text-secondary-500 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
