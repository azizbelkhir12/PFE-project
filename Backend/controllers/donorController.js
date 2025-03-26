const Donor = require('../models/Donor');
const { validationResult } = require('express-validator');

// Register a new donor
const registerDonor = async (req, res) => {
  

  const { name, email, password, address, zipCode, phone, status, img } = req.body;

  try {
    // Check if the donor already exists
    let donor = await Donor.findOne({ email });
    if (donor) {
      return res.status(400).json({ msg: 'Donor already exists' });
    }

    // Create a new donor
    donor = new Donor({
      name,
      email,
      password,
      address,
      zipCode,
      phone,
      status,
      img,
    });

    // Save the donor to the database
    await donor.save();

    res.status(201).json({ msg: 'Donor registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { registerDonor }; // Export the function with the correct name