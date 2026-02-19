const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
    const { department, doctorName, doctorId, date, timeSlot, reason } = req.body;
    try {
        // Prevent duplicate booking for same doctor, date, and time
        const existing = await Appointment.findOne({ doctorName, date, timeSlot, status: { $ne: 'rejected' } });
        if (existing) {
            return res.status(400).json({ message: 'This time slot is already booked for the selected doctor.' });
        }

        const appointment = await Appointment.create({
            department,
            doctorName,
            doctorId,
            patientName: req.user.name,
            patientEmail: req.user.email,
            patientId: req.user._id,
            date,
            timeSlot,
            reason
        });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'admin') {
            // Admin sees everything
            appointments = await Appointment.find({}).sort({ createdAt: -1 });
        } else if (req.user.role === 'doctor') {
            // Doctors ONLY see their own appointments
            appointments = await Appointment.find({
                $or: [{ doctorId: req.user._id }, { doctorName: req.user.name }]
            }).sort({ createdAt: -1 });
        } else {
            // Patients see only their own
            appointments = await Appointment.find({ patientId: req.user._id }).sort({ createdAt: -1 });
        }
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Security: Ensure doctor only updates their OWN appointments
        if (req.user.role === 'doctor' && appointment.doctorName !== req.user.name && String(appointment.doctorId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized to update this appointment' });
        }

        appointment.status = status;
        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        await appointment.deleteOne();
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
