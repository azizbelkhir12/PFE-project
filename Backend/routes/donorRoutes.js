const express = require('express');
const donorController = require('../controllers/donorController'); 
const router = express.Router();
const uploadImage = require('../utils/uploadImage');
const imgurUpload = require('../utils/imgurUpload');



// Register a new donor
router.post('/register', donorController.registerDonor); 
router.get('/donors', donorController.getAllDonors); 
router.get('/donors/:id', donorController.getDonorById);
router.put('/update/:id', uploadImage.single('img'), imgurUpload, donorController.updateDonor);
router.post('/createDonation', donorController.createDonation);
router.post('/payment', donorController.payment);
router.post('/verifyPayment/:id', donorController.verifyPayment);
router.get('/donations/:id', donorController.getDonationsByDonorId);
router.post('/assign-beneficiary', donorController.assignBeneficiaryToDonor);
router.get('/with-beneficiaries/:id', donorController.getDonorWithBeneficiaries);




module.exports = router;