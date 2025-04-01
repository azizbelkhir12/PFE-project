const Demande = require('../models/Demande');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.Demande = async (req, res) => {
    try {
        const { name, email, password, address, phone, gouvernorat, reason } = req.body;
        const image = req.file ? req.file.path : null; // Store image path

        if (!name || !email || !password || !address || !phone || !gouvernorat || !reason) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await Demande.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        // Create a new Demande instance
        const newDemande = new Demande({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            address: address.trim(),
            phone: phone.trim(),
            gouvernorat: gouvernorat.trim(),
            reason: reason.trim(),
            image
        });

        await newDemande.save();
        res.status(201).json({ message: 'Demande created successfully', demande: newDemande });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
