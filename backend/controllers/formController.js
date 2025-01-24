const Form = require('../models/Form');
const Submission = require('../models/Submission');

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubmitForm = async (req, res) => {
  try {
    // Find all submissions and populate the `formId` field to fetch the associated form title
    const submissions = await Submission.find()
      .populate('formId', 'title') // Only fetch the `title` field from the `Form` model
      .select('status formId'); // Include only `status` and `formId` in the response

    // Map through the submissions to extract relevant details
    const result = submissions.map((submission) => ({
      formTitle: submission.formId.title, // Get the form title
      status: submission.status, // Get the status of the submission
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.submitForm = async (req, res) => {
  try {
    const { formId, responses } = req.body;
    const newSubmission = new Submission({ formId, responses });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

