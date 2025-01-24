const Form = require('../models/Form');
const Submission = require('../models/Submission');

exports.createForm = async (req, res) => {
  try {
    const { title, fields } = req.body;
    const newForm = new Form({ title, fields });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().populate('formId');
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify or reject a submission based on the provided status
exports.verifySubmission = async (req, res) => {
  try {
    // Extract id and status directly from request body
    const { id, status } = req.body;  

    console.log(status,"sttus")
   

    // Find the submission by its ID and update the status
    const submission = await Submission.findByIdAndUpdate(id, { status: status }, { new: true });

    // If no submission is found with the provided id
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Return the updated submission as a response
    res.status(200).json(submission);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID not found" });
    }

    const deletedSubmission = await Submission.findOneAndDelete({ _id: id });

    if (!deletedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
