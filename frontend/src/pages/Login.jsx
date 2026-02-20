import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../services/api';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Real API call
            const res = await login({ email, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            navigate('/dashboard');
            
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-secondary-50">
            <div className="card w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-none">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-secondary-900">Welcome Back</h2>
                    <p className="text-secondary-500 mt-2">Sign in to access your health dashboard</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn btn-primary py-3 text-lg shadow-lg shadow-primary-500/30">
                        Sign In
                    </button>
                    
                    <p className="text-center text-secondary-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                            Create Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
