import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'white',
            padding: '1rem 2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            marginBottom: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', margin: 0, fontWeight: '700' }}>MediCore Pro</h1>

                {user && (
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link to="/dashboard" style={{
                            textDecoration: 'none',
                            color: 'var(--text-main)',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                        }}>Dashboard</Link>

                        {user.user.role === 'patient' && (
                            <Link to="/book" style={{
                                textDecoration: 'none',
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem'
                            }}>Book Appointment</Link>
                        )}

                        <Link to="/schedule" style={{
                            textDecoration: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem'
                        }}>{user.user.role === 'doctor' ? 'My Schedule' : 'My Appointments'}</Link>

                        {(user.user.role === 'admin' || user.user.email === 'kartikchoudhary@gmail.com') && (
                            <Link to="/admin" style={{
                                textDecoration: 'none',
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem'
                            }}>Admin Panel</Link>
                        )}
                    </div>
                )}
            </div>

            {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.user.role}</div>
                    </div>
                    <button className="btn btn-logout-nav" style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        borderRadius: '50px',
                        padding: '0.5rem 1.2rem',
                        fontSize: '0.85rem',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }} onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
                    <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', borderRadius: '50px', padding: '0.5rem 1.5rem' }}>Register</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
