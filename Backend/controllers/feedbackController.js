const Contact = require("../models/Feedback");

exports.submitFeedbackForm = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: "Merci pour votre message!",
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const Feedbacks = await Contact.find({});
    res.status(200).json(Feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des Feedbacks', error });
  }
};


exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Contact.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback non trouvé' });
    }
    res.status(200).json({ message: 'Feedback supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du Feedback', error });
  }
}