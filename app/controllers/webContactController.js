const Joi = require('joi');

const CollectionSchema = require('../utils/collectionSchema');
const LoggerHelper = require('../utils/loggerHelper').logger;

const mycote = require('../cote/mycote');

function handleWebContact(req, res) {
    // Joi validation options
    const _validationOptions = {
        abortEarly: false, // abort after the last validation error
        allowUnknown: true, // allow unknown keys that will be ignored
        stripUnknown: true // remove unknown keys from the validated data
    };

    Joi.validate(req.body, CollectionSchema.webcontact, _validationOptions, (err, data) => {
        if (err) {
            LoggerHelper.error(err);
            res.status(409).send(err.message);
            return;
        }

        mycote.saveContact(data);

        res.status(200).send('WebContact is being processed');
        return;
    });
}

function handleSendEmail(req, res) {
    // Joi validation options
    const _validationOptions = {
        abortEarly: false, // abort after the last validation error
        allowUnknown: true, // allow unknown keys that will be ignored
        stripUnknown: true // remove unknown keys from the validated data
    };

    Joi.validate(req.body, CollectionSchema.webcontact, _validationOptions, (err, data) => {
        if (err) {
            LoggerHelper.error(err);
            res.status(409).send(err.message);
            return;
        }

        mycote.sendEmail(data);
        
        res.status(200).send('email request is being processed');
        return;
    });
}

module.exports = {
    handleWebContact : handleWebContact,
    handleSendEmail : handleSendEmail
};
