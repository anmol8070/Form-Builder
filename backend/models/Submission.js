const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  responses: Object,
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
});
module.exports = mongoose.model('Submission', SubmissionSchema);
