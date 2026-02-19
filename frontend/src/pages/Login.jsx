import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(formData);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                <h1 style={{ marginBottom: '0.5rem', textAlign: 'center', color: 'var(--primary)', fontSize: '2rem' }}>MediCore Pro</h1>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enterprise Appointment Portal</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input required type="email" placeholder="email@example.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ borderRadius: '50px', padding: '1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <input required type="password" placeholder="••••••••" onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ borderRadius: '50px', padding: '1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', borderRadius: '50px', padding: '1rem', fontSize: '1rem', fontWeight: '600', marginTop: '1rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>Login</button>
                </form>
                <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
