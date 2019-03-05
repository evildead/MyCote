const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

const ConfigHelper = require('../utils/ConfigHelper');

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

// connect to the database
const mongoDBUri = ConfigHelper.config.get('dbConnection');
mongoose.connect(mongoDBUri, {
    useNewUrlParser: true
});

const LogHelper = require('../utils/loggerHelper').logger;

const host = ConfigHelper.config.get(`emailSender.host`);
const port = ConfigHelper.config.get(`emailSender.port`);
const accountName = ConfigHelper.config.get(`emailSender.accountName`);
const accountPw = ConfigHelper.config.get(`emailSender.accountPw`);

// transporter configuration
let transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: accountName, // username
        pass: accountPw // password
    },
    tls: {
        ciphers: 'SSLv3'
    },
    requireTLS: true
});

if(port == 465) {
    transporter.set('secure', true);
}

const emailerResponder = new cote.Responder({
    name: 'emailerResponder',
    key: ConfigHelper.config.get('cote.key-sendemail'),
    respondsTo: ['sendEmail']
});

emailerResponder.on('sendEmail', (req) => {
    const contact = req.val;
    LogHelper.info(`emailerResponder Notified! req.name ${contact.name}; req.surname ${contact.surname}; req.email ${contact.email};`);

    // setup email data with unicode symbols
    let mailOptions = {
        from: accountName, // sender address
        to: contact.email, // list of receivers
        subject: "Saved to MyCote", // Subject line
        text: `Hello ${contact.name} ${contact.surname}: your account has been saved to MyCote`, // plain text body
        html: `Hello ${contact.name} ${contact.surname}: your account has been saved to <b>MyCote</b>` // html body
    };

    return transporter.sendMail(mailOptions);
});

module.exports = {

};
