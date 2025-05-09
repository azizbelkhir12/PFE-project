const Donor = require('../models/Donor');
const Donation = require('../models/Donation');
const Beneficiary = require('../models/Beneficiary');
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { validationResult } = require('express-validator');

// Register a new donor
 exports.registerDonor = async (req, res) => {
  

  const { name, email, password, address, zipCode, phone, status, img  } = req.body;

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


exports.getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find({});
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des donateurs', error });
  }
};


exports.getDonorById = async (req, res) => {
  const { id } = req.params;
  try {
    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    } 
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving donor', error });
  }   
}


exports.updateDonor = async (req, res) => {
  const donorId = req.params.id;
  const updateData = req.body;

  try {
    // If image was uploaded and imgur middleware set req.imgurUrl, include it
    if (req.imgurUrl) {
      updateData.img = req.imgurUrl;
    }

    // Prevent password updates from this route
    if (updateData.password) {
      return res.status(400).json({ error: 'Password cannot be updated from this route' });
    }

    const updatedDonor = await Donor.findByIdAndUpdate(donorId, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedDonor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.status(200).json({ message: 'Donor updated successfully', donor: updatedDonor });
  } catch (err) {
    console.error('Update donor error:', err);
    res.status(500).json({ error: 'Failed to update donor', details: err.message });
  }
};


exports.createDonation = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentType , guestName, guestEmail,project, paymentId, status, donorId } = req.body;
    
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
      donorId,
      paymentMethod,
      paymentType, 
      donorId,
      guestName: guestName,
      guestEmail: guestEmail,
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




exports.payment =  async (req, res) => {
  const url = "https://developers.flouci.com/api/generate_payment";
  const payload = {
    app_token: "cf57060b-a87e-48e6-9eb1-3f44e988f182",
    app_secret: process.env.FLOUCI_SECRET,
    amount: req.body.amount,
    accept_card: "true",
    session_timeout_secs: 2000,
    success_link: "http://localhost:4200/donateur-compte/profil",
    fail_link: "http://localhost:4200/donateur-compte/profil",
    developer_tracking_id: "a838b500-ef34-42b4-b783-cc1712f1c22f",
  };

  await axios
    .post(url, payload)
    .then((result) => {
      res.send(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.verifyPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { amount, guestName, guestEmail } = req.body;

    if (!paymentId) {
      return res.status(400).json({ success: false, message: "Payment ID is required" });
    }

    const verificationUrl = `https://developers.flouci.com/api/verify_payment/${paymentId}`;

    const verificationResponse = await axios.get(verificationUrl, {
      headers: {
        'Content-Type': 'application/json',
        'apppublic': 'cf57060b-a87e-48e6-9eb1-3f44e988f182',
        'appsecret': process.env.FLOUCI_SECRET,
      },
    });

    const verificationData = verificationResponse.data;

    if (verificationData.success && verificationData.result?.status === "SUCCESS") {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentDetails: verificationData.result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        details: verificationData,
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.response?.data || error.message || 'Unknown error',
    });
  }
};




exports.getDonationsByDonorId = async (req, res) => {
  try {
    const { id } = req.params; // Changed from donorId to id to match router

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Donor ID is required'
      });
    }

    const donations = await Donation.find({ donorId: id }).sort({ createdAt: -1 });
    // Note: Changed to use id but mapping to donorId in query

    res.status(200).json({
      success: true,
      donations
    });
  } catch (error) {
    console.error('Error fetching donations by donorId:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations'
    });
  }
};

// Example controller method to assign beneficiary to donor
exports.assignBeneficiaryToDonor = async (req, res) => {
  const { donorId, beneficiaryId } = req.body;

  try {
      const donor = await Donor.findById(donorId);
      const beneficiary = await Beneficiary.findById(beneficiaryId);

      if (!donor || !beneficiary) {
          return res.status(404).json({ message: "Donor or Beneficiary not found" });
      }

      // Avoid duplicate assignments
      if (!donor.assignedBeneficiaries.includes(beneficiaryId)) {
          donor.assignedBeneficiaries.push(beneficiaryId);
          await donor.save();
      }

      res.status(200).json({ message: "Beneficiary assigned to donor" });
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getDonorWithBeneficiaries = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id)
      .populate({
        path: 'assignedBeneficiaries',
        select: 'name lastname children photoUrl' // specify only what you need
      });

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
