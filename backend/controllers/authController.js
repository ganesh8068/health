const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Strict Domain Check for Doctors
        if (role === 'doctor' && !email.endsWith('@medcore.in')) {
            return res.status(400).json({ message: 'Doctors must use a valid @medcore.in email address.' });
        }

        const user = await User.create({ name, email, password, role, specialization: role === 'doctor' ? req.body.specialization : undefined });
        res.status(201).json({
            message: 'User registered successfully',
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                user: { _id: user._id, name: user.name, email: user.email, role: user.role },
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
