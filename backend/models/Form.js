const mongoose = require('mongoose');
const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fields: [{ name: String, type: String }],
});
module.exports = mongoose.model('Form', FormSchema);