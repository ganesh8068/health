import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Add token to requests
API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const fetchAppointments = () => API.get('/appointments');
export const bookAppointment = (data) => API.post('/appointments', data);
export const updateAppointment = (id, status) => API.put(`/appointments/${id}`, { status });
export const updateTreatment = (id, data) => API.put(`/appointments/${id}/treatment`, data);
export const fetchStats = () => API.get('/appointments/stats');
export const rescheduleAppointment = (id, data) => API.put(`/appointments/${id}/reschedule`, data);
export const deleteAppointment = (id) => API.delete(`/appointments/${id}`);
export const fetchDoctors = (specialization) => API.get(`/users/doctors?specialization=${specialization}`);
