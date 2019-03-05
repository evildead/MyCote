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

const webContactRequester = new cote.Requester({
    name: 'webContactRequester',
    key: ConfigHelper.config.get('cote.key-savecontact'),
    requests: ['saveWebContact']
});

const sendEmailRequester = new cote.Requester({
    name: 'sendEmailRequester',
    key: ConfigHelper.config.get('cote.key-sendemail'),
    requests: ['sendEmail']
});

function saveContact(contact) {
    const saveContactRequest = {
        type: 'saveWebContact',
        val: contact
    };
    LogHelper.info('webContactRequester: I am going to send ' + JSON.stringify(saveContactRequest));
    webContactRequester.send(saveContactRequest, (res) => {
        LogHelper.info('webContactRequester. Response received: ' + res);
    });
}

function sendEmail(contact) {
    const sendEmailRequest = {
        type: 'sendEmail',
        val: contact
    };
    LogHelper.info('sendEmailRequester: I am going to send ' + JSON.stringify(sendEmailRequest));
    sendEmailRequester.send(sendEmailRequest)
        .then((res) => {
            LogHelper.info('sendEmailRequester. Response received: ' + res);
        })
        .catch((err) => {
            LogHelper.error(err);
        });
}

module.exports = {
    saveContact: saveContact,
    sendEmail: sendEmail
};
