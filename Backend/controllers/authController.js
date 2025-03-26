const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');
const volunteer = require('../models/Volunteer');
const Beneficiary = require('../models/Beneficiary'); 
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
      const { email, password, userType } = req.body;

       // Validate userType
    const validTypes = ['donor', 'volunteer', 'beneficiary'];
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
          Model = volunteer;
          break;
        case 'beneficiary':
          Model = Beneficiary;
          break;
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }
      // Check if user exists
      const user = await Model.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
      
      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
      
      // Create and sign JWT token
      const token= {
        id: user.id,
        email: user.email,
        userType: userType
      };
      
      jwt.sign(token, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;

        // Return user data (without password) and token
        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
          message: 'Login successful',
          token,
          user: userData
        });
      });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};