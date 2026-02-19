const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/', protect, restrictTo('patient'), createAppointment);
router.get('/', protect, getAppointments);
router.put('/:id', protect, restrictTo('doctor', 'admin'), updateAppointmentStatus);
router.delete('/:id', protect, restrictTo('admin'), require('../controllers/appointmentController').deleteAppointment);

module.exports = router;
