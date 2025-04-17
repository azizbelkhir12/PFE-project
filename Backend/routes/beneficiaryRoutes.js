const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const {auth} = require('../utils/auth'); // Assuming you have an auth middleware for authentication



router.post('/create', beneficiaryController.createBeneficiary);
router.get('/getAll', beneficiaryController.getAllBeneficiaries);
router.get('/get/:id', beneficiaryController.getBeneficiaryById);
router.patch('/update/:id', beneficiaryController.updateBeneficiary);
router.delete('/delete/:id', beneficiaryController.deleteBeneficiary);

module.exports = router;