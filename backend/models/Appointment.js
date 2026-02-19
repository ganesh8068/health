const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    department: { type: String, required: true },
    doctorName: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    reason: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
