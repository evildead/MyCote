const express = require('express');
const router = express.Router();
const multer = require('multer');

const ConfigHelper = require('./utils/ConfigHelper');
const LoggerHelper = require('./utils/loggerHelper');

const WebContactController = require('./controllers/webContactController');

const multerObj = multer({
    dest: 'upload'
});

// export router
module.exports = router;

// Handle post WebContact
router.post('/webcontact', multerObj.any(), WebContactController.handleWebContact);

// Handle post sendEmail
router.post('/sendemail', multerObj.any(), WebContactController.handleSendEmail);
