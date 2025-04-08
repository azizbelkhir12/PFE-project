const Demande = require('../models/Demande');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Benevole = require('../models/Volunteer');

exports.Demande = async (req, res) => {
    try {
        const { name,Prenom, age, email, password, address, phone, gouvernorat, reason } = req.body;
        const image = req.file ? req.file.path : null; // Store image path

        if (!name || !Prenom || !age || !email || !password || !address || !phone || !gouvernorat || !reason) {
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
            Prenom: Prenom.trim(),
            age: age,
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


exports.getAllDemandes = async (req, res) => {
    try {
      const demandes = await Demande.find();
      res.status(200).json(demandes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

exports.acceptDemande = async (req, res) => {
    try {
            const { id } = req.params;

            const demande = await Demande.findById(id);
            if (!demande) {
                    return res.status(404).json({ message: 'Demande not found' });
            }

            // Check if email already exists as a volunteer
            const existingBenevole = await Benevole.findOne({ email: demande.email });
            if (existingBenevole) {
                    return res.status(400).json({ message: 'A volunteer with this email already exists' });
            }

            // Create new volunteer
            const newBenevole = new Benevole({
                    name: demande.name,
                    lastName: demande.Prenom,
                    age: demande.age,
                    email: demande.email,
                    password: demande.password, // Already hashed
                    address: demande.address,
                    phone: demande.phone,
                    gouvernorat: demande.gouvernorat,
                    image: demande.image,
                    status: 'active'
            });

            await newBenevole.save();

            // Delete the demande from the database
            await Demande.findByIdAndDelete(id);

            res.status(200).json({ 
                    message: 'Demande accepted, volunteer created, and demande deleted',
                    benevole: newBenevole
            });
    } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
    }
};

// Reject a demande
exports.rejectDemande = async (req, res) => {
    try {
      const { id } = req.params;
  
      const demande = await Demande.findById(id);
      if (!demande) {
        return res.status(404).json({ message: 'Demande not found' });
      }
  
      demande.status = 'rejected';
      await demande.save();
  
      res.status(200).json({ message: 'Demande rejected successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
