const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');
const Volunteer = require('../models/Volunteer');
const Beneficiary = require('../models/Beneficiary');
const Admin = require('../models/Admin'); 
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
      const { email, password, userType } = req.body;

      // Validate userType
      const validTypes = ['donor', 'volunteer', 'beneficiary', 'admin']; // Added admin
      if (!validTypes.includes(userType)) {
        return res.status(400).json({ message: 'Invalid user type' });
      }
      
      // Determine which model to use based on userType
      let Model;
      switch(userType) {
        case 'donor':
          Model = Donor;
          break;
        case 'volunteer':
          Model = Volunteer;
          break;
        case 'beneficiary':
          Model = Beneficiary;
          break;
        case 'admin':
          Model = Admin;
          break;
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }

      // Check if user exists
      const user = await Model.findOne({ email }).select('+password');
      if (!user) return res.status(400).json({ message: `${userType} not found` });
      
      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      
      // Create token payload
      const tokenPayload = {
        id: user._id,
        email: user.email,
        userType: userType,
        role: userType === 'admin' ? 'admin' : 'user' // Add role distinction
      };
      
      // Generate token
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Return user data (without password) and token
      const userData = user.toObject();
      delete userData.password;

      res.status(200).json({
        message: 'Login successful',
        token,
        user: userData
      });
      
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }

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

}

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
