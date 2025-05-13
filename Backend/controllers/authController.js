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
          token,
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
          data: {
            user: userData,
            userType: userType
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
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = '1h'; // Token expires in 1 hour

  try {
    // Validate userType
    const validTypes = ['admin', 'beneficiary', 'volunteer', 'donor'];
    if (!validTypes.includes(userType)) {
      return res.status(400).json({ message: 'Type d\'utilisateur invalide.' });
    }

    // Get the correct model
    const Models = {
      admin: Admin,
      beneficiary: Beneficiary,
      volunteer: Volunteer,
      donor: Donor
    };
    const Model = Models[userType];

    // Find user
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Create signed token
    const token = jwt.sign(
      { 
        email: user.email, 
        userType, 
        id: user._id,
        purpose: 'password_reset' // Add purpose to prevent token misuse
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // URL encode the token for safety
    const encodedToken = encodeURIComponent(token);
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${encodedToken}`;
    
    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Réinitialisation de mot de passe',
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe (valable 1 heure):</p>
             <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
             <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>`
    });

    res.status(200).json({ message: 'Email envoyé avec instructions.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};

exports.resetPassword = async (req, res) => {
  // Get token from either body or query
  const token = req.body.token || req.query.token;
  const { newPassword } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token et nouveau mot de passe requis.' });
    }

    // Decode the token if it came from URL
    const decodedToken = decodeURIComponent(token);

    // Verify token
    const decoded = jwt.verify(decodedToken, JWT_SECRET);
    
    // Additional security check
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: 'Token invalide.' });
    }

    // Get correct model based on token contents
    const Models = {
      admin: Admin,
      beneficiary: Beneficiary,
      volunteer: Volunteer,
      donor: Donor
    };
    const Model = Models[decoded.userType];

    if (!Model) {
      return res.status(400).json({ message: 'Type d\'utilisateur invalide.' });
    }

    // Find user
    const user = await Model.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Le lien a expiré. Veuillez faire une nouvelle demande.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Lien de réinitialisation invalide.' });
    }
    
    res.status(500).json({ message: 'Erreur du serveur.' });
  }
};