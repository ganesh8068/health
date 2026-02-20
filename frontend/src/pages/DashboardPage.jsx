import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
// import { fetchStats, fetchAppointments } from '../services/api'; // Keeping original imports

const DashboardPage = ({ user, setUser }) => {
    // Mock data for development if API is not available
    const [stats, setStats] = useState({ total: 12, upcoming: 4, completed: 8, cancelled: 0 });
    const [recentAppointments, setRecentAppointments] = useState([
        { _id: '1', doctorName: 'Dr. Smith', patientName: 'John Doe', department: 'Cardiology', date: '2023-10-25', status: 'upcoming' },
        { _id: '2', doctorName: 'Dr. Jones', patientName: 'Jane Doe', department: 'Dermatology', date: '2023-10-20', status: 'completed' },
    ]);

    useEffect(() => {
        // In a real scenario, uncomment and use the API calls
        /*
        const loadDashboardData = async () => {
            try {
                const [statsRes, appointmentsRes] = await Promise.all([
                    fetchStats(),
                    fetchAppointments()
                ]);
                setStats(statsRes.data);
                setRecentAppointments(appointmentsRes.data.slice(0, 5));
            } catch (err) {
                console.error("Failed to load dashboard data");
            }
        };
        loadDashboardData();
        */
    }, []);

    return (
        <div className="min-h-screen bg-secondary-50">
            <Navbar user={user} setUser={setUser} />
            <main className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-secondary-900">Welcome, {user.name || user.user?.name || 'User'}</h1>
                    <p className="text-secondary-500 font-medium mt-1">
                        MediCore Pro • <span className="uppercase tracking-wider text-xs font-bold bg-secondary-200 px-2 py-1 rounded-full text-secondary-700">{user.role || user.user?.role}</span>
                    </p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="card border-l-4 border-l-primary-500">
                        <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wide mb-2">Total Appointments</h3>
                        <p className="text-4xl font-display font-bold text-secondary-900">{stats.total}</p>
                    </div>
                    <div className="card border-l-4 border-l-blue-500">
                        <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wide mb-2">Upcoming</h3>
                        <p className="text-4xl font-display font-bold text-blue-600">{stats.upcoming}</p>
                    </div>
                    <div className="card border-l-4 border-l-green-500">
                        <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wide mb-2">Completed</h3>
                        <p className="text-4xl font-display font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="card border-l-4 border-l-red-500">
                        <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wide mb-2">Cancelled/Rejected</h3>
                        <p className="text-4xl font-display font-bold text-red-600">{stats.cancelled}</p>
                    </div>
                </div>

                {/* Alerts Section */}
                {(user.role === 'doctor' || user.user?.role === 'doctor') && stats.upcoming > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-10 flex items-start gap-4">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <h3 className="font-bold text-yellow-800">Action Required</h3>
                            <p className="text-yellow-700 text-sm mt-1">
                                You have <strong>{stats.upcoming}</strong> active appointments. Please visit <strong>My Schedule</strong> to approve pending requests or start consultations.
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <section className="col-span-1 lg:col-span-1">
                        <h2 className="text-xl font-bold text-secondary-900 mb-4">Quick Actions</h2>
                        <div className="flex flex-col gap-4">
                            {(user.role === 'patient' || user.user?.role === 'patient') && (
                                <Link to="/book" className="group bg-white p-4 rounded-xl shadow-soft border border-secondary-100 hover:border-primary-500 hover:shadow-md transition-all flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📅</div>
                                    <div>
                                        <strong className="block text-secondary-900 group-hover:text-primary-600 transition-colors">Book New Appointment</strong>
                                        <p className="text-sm text-secondary-500">Schedule a visit with a specialist</p>
                                    </div>
                                </Link>
                            )}
                            <Link to="/schedule" className="group bg-white p-4 rounded-xl shadow-soft border border-secondary-100 hover:border-primary-500 hover:shadow-md transition-all flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🕒</div>
                                <div>
                                    <strong className="block text-secondary-900 group-hover:text-primary-600 transition-colors">
                                        {(user.role === 'doctor' || user.user?.role === 'doctor') ? 'Manage Schedule' : 'View My Schedule'}
                                    </strong>
                                    <p className="text-sm text-secondary-500">
                                        {(user.role === 'doctor' || user.user?.role === 'doctor') ? 'See your daily appointments' : 'Check your upcoming and past visits'}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </section>

                    {/* Recent Activity */}
                    <section className="col-span-1 lg:col-span-2">
                        <h2 className="text-xl font-bold text-secondary-900 mb-4">Recent Activity</h2>
                        <div className="bg-white rounded-2xl shadow-soft border border-secondary-100 overflow-hidden">
                            {recentAppointments.length > 0 ? (
                                <div className="divide-y divide-secondary-100">
                                    {recentAppointments.map(app => (
                                        <div key={app._id} className="p-4 hover:bg-secondary-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <strong className="block text-secondary-900 font-semibold text-lg">
                                                    {(user.role === 'patient' || user.user?.role === 'patient') ? app.doctorName : app.patientName}
                                                </strong>
                                                <div className="flex items-center gap-2 text-sm text-secondary-500 mt-1">
                                                    <span className="bg-secondary-100 px-2 py-0.5 rounded text-secondary-600 font-medium">{app.department}</span>
                                                    <span>•</span>
                                                    <span>{app.date}</span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                ${app.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : ''}
                                                ${app.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                                                ${app.status === 'cancelled' || app.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                                                ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                            `}>
                                                {app.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-secondary-500 italic">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
