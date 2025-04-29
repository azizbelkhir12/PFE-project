// donationController.js
const Donation = require('../models/Donation');

exports.createDonation = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentType , guestName, guestEmail,project, paymentId, status } = req.body;
    const donorId = req.userId || null;

    // Check for duplicate paymentId
    if (paymentId) {
      const existingDonation = await Donation.findOne({ paymentId });
      if (existingDonation) {
        return res.status(200).json({ 
          success: true,
          message: 'Donation already recorded',
          donation: existingDonation
        });
      } 
    }

    // Set status based on payment method and verification
    let donationStatus = 'completed'; // Default to completed
    if ((paymentMethod === 'credit_card' || paymentMethod === 'flouci') && !paymentId) {
      donationStatus = 'pending';
    }

    // Use the status from request if provided (for verified payments)
    if (status) {
      donationStatus = status;
    }

    const newDonation = new Donation({
      amount,
      paymentMethod,
      paymentType, 
      donorId,
      guestName: donorId ? null : guestName,
      guestEmail: donorId ? null : guestEmail,
      project,
      paymentId,
      status: donationStatus
    });

    await newDonation.save();
    res.status(201).json({ 
      success: true,
      message: 'Donation recorded',
      donation: newDonation 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating donation' 
    });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({});
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des dons', error });
  }
};