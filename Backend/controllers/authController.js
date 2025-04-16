const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');
const Volunteer = require('../models/Volunteer');
const Beneficiary = require('../models/Beneficiary');
const Admin = require('../models/Admin'); 
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Validate user type
        const validTypes = ['donor', 'volunteer', 'beneficiary', 'admin'];
        if (!validTypes.includes(userType)) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Invalid user type. Must be one of: donor, volunteer, beneficiary, admin' 
            });
        }

        // Model selection
        const Model = {
            donor: Donor,
            volunteer: Volunteer,
            beneficiary: Beneficiary,
            admin: Admin
        }[userType];

        if (!Model) {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error: Invalid model configuration'
            });
        }

        // Find user with password
        const user = await Model.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: `${userType} not found with this email address`
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect password'
            });
        }

        // Create token payload
        const tokenPayload = {
            id: user._id,
            email: user.email,
            userType,
            role: user.role || (userType === 'admin' ? 'admin' : 'user')
        };

        // Generate token
        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        // Prepare user data for response
        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            status: 'success',
            token, // Client will store this
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
            data: {
                user: userData,
                userType : userType
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during login',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

exports.registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create new admin
        const newAdmin = new Admin({ email, password });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};