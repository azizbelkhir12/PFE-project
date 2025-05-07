const express = require('express');
const router = express.Router();
const Abonnement = require('../models/Abonnement');
const axios = require('axios');

exports.payment =  async (req, res) => {
  const url = "https://developers.flouci.com/api/generate_payment";
  const payload = {
    app_token: "cf57060b-a87e-48e6-9eb1-3f44e988f182",
    app_secret: process.env.FLOUCI_SECRET,
    amount: req.body.amount,
    accept_card: "true",
    session_timeout_secs: 2000,
    success_link: "http://localhost:4200/benevole-compte/abonnement",
    fail_link: "http://localhost:4200/benevole-compte/abonnement",
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


exports.createAbonnement = async (req, res) => {
  try {
    const { volunteer, name, lastname, paymentMethod, amount, status, paymentType } = req.body;

    // Validate required fields
    if (!volunteer || !name || !lastname || !paymentMethod || !amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    // Set default status if not provided
    let abonnementStatus = status || 'pending';

    // Validate payment method
    const validPaymentMethods = ['credit_card', 'bank_transfer', 'cash', 'flouci'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid payment method' 
      });
    }

    const newAbonnement = new Abonnement({
      volunteer,
      name,
      lastname,
      paymentMethod,
      amount,
      status: abonnementStatus
    });

    await newAbonnement.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Abonnement created successfully',
      abonnement: newAbonnement 
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating abonnement',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// Get abonnement(s) by volunteer ID
exports.getAbonnementByVolunteer = async (req, res) => {
  try {
    const volunteerId = req.params.volunteerId;
    if (!volunteerId) {
      return res.status(400).json({ success: false, message: "Volunteer ID is required" });
    }
    // Find all abonnements for the volunteer
    const abonnements = await Abonnement.find({ volunteer: volunteerId });
    res.status(200).json({ success: true, abonnements });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
