import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'text-primary-600 font-bold bg-primary-50' : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50';
    };

    const navLinkClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";

    return (
        <nav className="bg-white shadow-soft sticky top-0 z-50 mb-8 border-b border-secondary-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold font-display text-lg">M</div>
                        <h1 className="text-xl font-display font-bold text-secondary-900 tracking-tight">MediCore Pro</h1>
                    </Link>

                    {/* Navigation Links */}
                    {user && (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/dashboard" className={`${navLinkClass} ${isActive('/dashboard')}`}>
                                Dashboard
                            </Link>

                            {(user.role === 'patient' || user.user?.role === 'patient') && (
                                <Link to="/book" className={`${navLinkClass} ${isActive('/book')}`}>
                                    Book Appointment
                                </Link>
                            )}

                            <Link to="/schedule" className={`${navLinkClass} ${isActive('/schedule')}`}>
                                {(user.role === 'doctor' || user.user?.role === 'doctor') ? 'My Schedule' : 'My Appointments'}
                            </Link>
                        </div>
                    )}

                    {/* User Profile / Auth Action */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-bold text-secondary-900">{user.name || user.user?.name}</div>
                                    <div className="text-xs text-secondary-500 font-medium capitalize">{user.role || user.user?.role}</div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 hover:text-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-semibold text-secondary-600 hover:text-primary-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
