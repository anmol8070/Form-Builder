const express = require('express');
const { getForms, submitForm, getSubmitForm } = require('../controllers/formController');
const router = express.Router();

router.get('/', getForms);
router.post('/submit', submitForm);
router.get("/getSubmitForm",getSubmitForm)

module.exports = router;