const express = require('express');
const { createForm, getSubmissions, verifySubmission, deleteSubmission } = require('../controllers/adminController');
const router = express.Router();

// Route to create a form
router.post('/create', createForm);

// Route to get all submissions
router.get('/submissions', getSubmissions);

// Route to verify or reject a submission
// PATCH request to update submission status
router.patch('/submissions/status', verifySubmission);  // Use PATCH for status updates

router.post("/deleteSubmission",deleteSubmission)

module.exports = router;
