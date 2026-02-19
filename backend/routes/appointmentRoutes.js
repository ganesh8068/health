const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus, updateTreatment, deleteAppointment, getAppointmentStats, rescheduleAppointment } = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/', protect, restrictTo('patient'), createAppointment);
router.get('/', protect, getAppointments);
router.get('/stats', protect, getAppointmentStats);
router.put('/:id', protect, restrictTo('doctor', 'admin'), updateAppointmentStatus);
router.put('/:id/treatment', protect, restrictTo('doctor'), updateTreatment);
router.put('/:id/reschedule', protect, restrictTo('patient', 'admin'), rescheduleAppointment);
router.delete('/:id', protect, restrictTo('admin', 'patient'), deleteAppointment);

module.exports = router;
