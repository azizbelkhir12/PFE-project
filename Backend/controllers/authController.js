const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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


exports.forgotPassword = async (req, res) => {
    const { email, userType } = req.body;
  
    try {
      let user = null;
      let Model = null;
  
      switch (userType) {
        case 'admin':
          Model = Admin;
          break;
        case 'beneficiary':
          Model = Beneficiary;
          break;
        case 'volunteer':
          Model = Volunteer;
          break;
        case 'donor':
          Model = Donor;
          break;
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }
  
      user = await Model.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your Gmail address
          pass: process.env.EMAIL_PASS, // Your Gmail App Password
        },
      });
  
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process:\n\n
              http://${req.headers.host}/reset-password/${token}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'An email has been sent to ' + user.email + ' with further instructions.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error sending reset email' });
    }
  };

  exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
        let user = null;
  
        user = await Admin.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (user) {
            modelType = 'Admin';
        }
        if (!user) {
            user = await Beneficiary.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
            if (user) {
                modelType = 'Beneficiary';
            }
        }
        if (!user) {
            user = await Volunteer.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
            if (user) {
                modelType = 'Volunteer';
            }
        }
        if (!user) {
            user = await Donor.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
            if (user) {
                modelType = 'Donor';
            }
        }
  
      if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Your password has been successfully updated.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error resetting password' });
    }
  };    