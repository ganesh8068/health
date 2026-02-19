import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import SchedulePage from './pages/SchedulePage';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={user ? <DashboardPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                <Route path="/book" element={user ? <BookingPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                <Route path="/schedule" element={user ? <SchedulePage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
