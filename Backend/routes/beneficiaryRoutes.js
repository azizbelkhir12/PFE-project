const express = require('express');
const router = express.Router();
const uploadImage = require('../utils/uploadImage');
const imgurUpload = require('../utils/imgurUpload');
const upload = require('../utils/upload'); 
const combinedUpload = require('../utils/combinedUpload');
const { uploadPersonalPhoto, uploadHousePhoto } = require('../utils/imgurUploadMultiple');
const beneficiaryController = require('../controllers/beneficiaryController');
const {auth} = require('../utils/auth'); // Assuming you have an auth middleware for authentication



router.post('/create', beneficiaryController.createBeneficiary);
router.get('/getAll', beneficiaryController.getAllBeneficiaries);
router.get('/get/:id', beneficiaryController.getBeneficiaryById);
router.patch('/update/:id', beneficiaryController.updateBeneficiary);
router.delete('/delete/:id', beneficiaryController.deleteBeneficiary);
router.put('/:id/photo',uploadImage.single('photo'),imgurUpload,beneficiaryController.updatePhoto);
router.put(
  '/:id/documents',
  combinedUpload,
  uploadPersonalPhoto,
  uploadHousePhoto,
  beneficiaryController.submitDocuments
);
module.exports = router;