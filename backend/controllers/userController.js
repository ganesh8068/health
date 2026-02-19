const User = require('../models/User');

exports.getDoctors = async (req, res) => {
    try {
        const { specialization } = req.query;
        let query = { role: 'doctor' };

        if (specialization) {
            query.specialization = specialization;
        }

        const doctors = await User.find(query).select('name specialization email');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
