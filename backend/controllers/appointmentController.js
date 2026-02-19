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

exports.updateTreatment = async (req, res) => {
    const { treatment, prescription, notes } = req.body;
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Security: Ensure doctor only updates their OWN appointments
        if (req.user.role === 'doctor' && appointment.doctorName !== req.user.name && String(appointment.doctorId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized to update this appointment' });
        }

        appointment.treatment = treatment || appointment.treatment;
        appointment.prescription = prescription || appointment.prescription;
        appointment.notes = notes || appointment.notes;
        appointment.status = 'completed'; // Automatically mark as completed when treatment is added

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

exports.getAppointmentStats = async (req, res) => {
    try {
        const query = {};
        if (req.user.role === 'patient') {
            query.patientId = req.user._id;
        } else if (req.user.role === 'doctor') {
            query.doctorId = req.user._id;
        }

        const total = await Appointment.countDocuments(query);
        const upcoming = await Appointment.countDocuments({ ...query, status: { $in: ['pending', 'approved'] } });
        const completed = await Appointment.countDocuments({ ...query, status: 'completed' });
        const cancelled = await Appointment.countDocuments({ ...query, status: 'rejected' });

        res.json({ total, upcoming, completed, cancelled });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rescheduleAppointment = async (req, res) => {
    const { date, timeSlot } = req.body;
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Security check
        if (String(appointment.patientId) !== String(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        appointment.date = date;
        appointment.timeSlot = timeSlot;
        appointment.status = 'pending'; // Reset to pending if rescheduled

        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
