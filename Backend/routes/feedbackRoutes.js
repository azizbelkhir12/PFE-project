const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");




// POST request to submit form
router.post("/", feedbackController.submitFeedbackForm);
router.get("/getFeedbacks", feedbackController.getFeedbacks);


module.exports = router;
