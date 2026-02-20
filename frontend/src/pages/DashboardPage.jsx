import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchStats, fetchAppointments } from '../services/api';

const DashboardPage = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsRes, appointmentsRes] = await Promise.all([
                    fetchStats(),
                    fetchAppointments()
                ]);
                setStats(statsRes.data);
                // Get the 3 most recent appointments
                setRecentAppointments(appointmentsRes.data.slice(0, 3));
            } catch (error) {
                console.error("Error loading dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadData();
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-surface-muted">
            <Navbar user={user} setUser={setUser} />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-secondary-900">Welcome, {user.user.name}</h1>
                    <p className="text-secondary-500 font-medium mt-1">MediCore Pro • {user.user.role.toUpperCase()}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-secondary-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-primary-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <h3 className="text-secondary-500 font-semibold relative z-10">Total Appointments</h3>
                        <p className="text-4xl font-display font-bold text-secondary-900 mt-2 relative z-10">{stats.total}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-secondary-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <h3 className="text-secondary-500 font-semibold relative z-10">Upcoming</h3>
                        <p className="text-4xl font-display font-bold text-orange-600 mt-2 relative z-10">{stats.pending}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-secondary-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <h3 className="text-secondary-500 font-semibold relative z-10">Completed</h3>
                        <p className="text-4xl font-display font-bold text-green-600 mt-2 relative z-10">{stats.completed}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-display font-bold text-secondary-900 mb-4 flex items-center">
                            <span className="w-1.5 h-6 bg-primary-500 rounded-full mr-3"></span>
                            Recent Activity
                        </h2>
                        <div className="flex flex-col gap-4">
                            {loading ? (
                                <p className="text-secondary-500">Loading activity...</p>
                            ) : recentAppointments.length > 0 ? (
                                recentAppointments.map(app => (
                                    <div key={app._id} className="bg-white p-5 rounded-xl shadow-sm border border-secondary-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg">
                                                {app.patientName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-secondary-900">{app.patientName}</h4>
                                                <p className="text-sm text-secondary-500">{new Date(app.date).toDateString()} • {app.time}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                            ${app.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                              app.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                              'bg-orange-100 text-orange-700'}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-secondary-500 bg-white p-6 rounded-xl border border-secondary-100 text-center">No recent activity.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-display font-bold text-secondary-900 mb-4 flex items-center">
                            <span className="w-1.5 h-6 bg-secondary-400 rounded-full mr-3"></span>
                            Quick Actions
                        </h2>
                        <div className="bg-white p-6 rounded-2xl shadow-soft border border-secondary-100 space-y-3">
                            <a href="/book" className="flex items-center p-3 rounded-xl hover:bg-primary-50 text-secondary-700 hover:text-primary-700 transition-colors font-medium border border-transparent hover:border-primary-100">
                                <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mr-3 font-bold">+</span>
                                New Appointment
                            </a>
                            <a href="/schedule" className="flex items-center p-3 rounded-xl hover:bg-secondary-50 text-secondary-700 transition-colors font-medium border border-transparent hover:border-secondary-200">
                                <span className="w-8 h-8 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center mr-3">📅</span>
                                View Schedule
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
