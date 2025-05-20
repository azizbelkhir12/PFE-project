const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');


router.post('/send', notificationController.sendNotification);
router.post('/sendmultiple', notificationController.broadcastNotification);
router.get('/getbeneficiary/:id', notificationController.getNotificationsByBeneficiaryId);
router.get('/stats', notificationController.getNotificationStats);
router.get('/getall', notificationController.getAllNotifications);

module.exports = router;