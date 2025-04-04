const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// POST request to submit form
router.post("/", feedbackController.submitFeedbackForm);

module.exports = router;
