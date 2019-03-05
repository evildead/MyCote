'use strict';

const Joi = require('joi');

// Web Contact
const webcontact = Joi.object().keys({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().email()
});

module.exports = {
    webcontact : webcontact
}
