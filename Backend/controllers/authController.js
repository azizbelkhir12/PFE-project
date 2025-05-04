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
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    // Configuration Nodemailer avec SMTP Brevo
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // ex: smtp-relay.brevo.com
      port: parseInt(process.env.EMAIL_PORT, 10), // ex: 587
      secure: false, // true si port 465, false pour 587
      auth: {
        user: process.env.EMAIL_USER, // votre email SMTP Brevo
        pass: process.env.EMAIL_PASS, // votre clé SMTP Brevo
      },
    });

    const resetUrl = `http://${req.headers.host}/reset-password/${token}`;

    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`, // expéditeur
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Vous recevez cet email car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n
Veuillez cliquer sur le lien suivant ou copiez-le dans votre navigateur pour finaliser la procédure :\n\n
${resetUrl}\n\n
Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.\n`,
      // Optionnel : ajoutez un html si vous voulez un email plus joli
      html: `<p>Vous recevez cet email car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.</p>
<p>Veuillez cliquer sur le lien suivant ou copiez-le dans votre navigateur pour finaliser la procédure :</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Un email a été envoyé à ' + user.email + ' avec les instructions.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l’envoi de l’email de réinitialisation.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    let user = null;

    user = await Admin.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) user = await Beneficiary.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) user = await Volunteer.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) user = await Donor.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Le token est invalide ou a expiré.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Votre mot de passe a été mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
};