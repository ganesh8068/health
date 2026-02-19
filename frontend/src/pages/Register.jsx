import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient', specialization: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.role === 'doctor' && !formData.email.endsWith('@medcore.in')) {
            alert('Doctors must use a valid @medcore.in email address.');
            return;
        }

        try {
            await register(formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                <h1 style={{ marginBottom: '0.5rem', textAlign: 'center', color: 'var(--primary)', fontSize: '2rem' }}>MediCore Pro</h1>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create your account</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                        <input required placeholder="John Doe" onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ borderRadius: '50px', padding: '0.8rem 1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input required type="email" placeholder="john@example.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ borderRadius: '50px', padding: '0.8rem 1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <input required type="password" placeholder="••••••••" onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ borderRadius: '50px', padding: '0.8rem 1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>Join as</label>
                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ borderRadius: '50px', padding: '0.8rem 1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0', width: '100%' }}>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>
                    {formData.role === 'doctor' && (
                        <div className="form-group">
                            <label style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>Specialization</label>
                            <select required onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} style={{ borderRadius: '50px', padding: '0.8rem 1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0', width: '100%' }}>
                                <option value="">Select Specialization</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                                <option value="Pediatrician">Pediatrician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="General Physician">General Physician</option>
                            </select>
                        </div>
                    )}
                    <button className="btn btn-primary" style={{ width: '100%', borderRadius: '50px', padding: '1rem', fontSize: '1rem', fontWeight: '600', marginTop: '1rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>Register</button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
