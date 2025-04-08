const volunteer = require('../models/Volunteer');

exports.getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await volunteer.find().select('-password'); // Exclude passwords
        res.json(volunteers);
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};