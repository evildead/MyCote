const mongoose = require('mongoose');

const ConfigHelper = require('../utils/ConfigHelper');
const LogHelper = require('../utils/loggerHelper').logger;

// Setup cote ///////////////////////////////////////////////////////
let coteOptions = {
    environment: ConfigHelper.config.get('cote.environment')
};

const redisHost = ConfigHelper.config.get('redis.host');
const redisPort = ConfigHelper.config.get('redis.port');
const redisPw = ConfigHelper.config.get('redis.pw');
let redisLoginOptions = {
    host: redisHost,
    port: redisPort
};
if(redisPw) {
    redisLoginOptions.password = redisPw;
    redisLoginOptions.tls = {servername: redisHost};
}
if(redisHost) {
    coteOptions.redis = redisLoginOptions;
}

const cote = require('cote')(coteOptions);
/////////////////////////////////////////////////////////////////////

const WebContact = require('../models/webContactModel');

// connect to the database
const mongoDBUri = ConfigHelper.config.get('dbConnection');
mongoose.connect(mongoDBUri, {
    useNewUrlParser: true
});

const webContactSaver = new cote.Responder({
    name: 'webContactSaver',
    key: ConfigHelper.config.get('cote.key-savecontact'),
    respondsTo: ['saveWebContact']
});

const webContactRequester = new cote.Requester({
    name: 'webContactRequester',
    key: ConfigHelper.config.get('cote.key-sendemail'),
    requests: ['sendEmail']
});

webContactSaver.on('saveWebContact', (req, cb) => {
    const contact = req.val;
    LogHelper.info(`Notified! req.name ${contact.name}; req.surname ${contact.surname}; req.email ${contact.email};`);

    let newWebContact = new WebContact({
        name: contact.name,
        surname: contact.surname,
        email: contact.email
    });

    newWebContact.save((err, result) => {
        if(err) {
            LogHelper.error(err);
            cb(err);
        }
        else {
            //cb(null, `webContactSaver: contact saved ${JSON.stringify(contact)}`);
            
            const emailRequest = {
                type: 'sendEmail',
                val: contact
            };
            
            LogHelper.info(`Contact saved! webContactRequester: is going to send an email request ${JSON.stringify(emailRequest)}`);
            webContactRequester.send(emailRequest, (res) => {
                LogHelper.info('webContactRequester. Response received: ' + res);
            });
            cb(null, `webContactRequester: email request sent ${JSON.stringify(emailRequest)}`);
        }
    });
});


module.exports = {

};
