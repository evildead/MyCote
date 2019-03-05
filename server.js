const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressWinston = require('express-winston');


// helpers
const ConfigHelper = require('./app/utils/ConfigHelper');
const LogHelper = require('./app/utils/loggerHelper').logger;
const ignoreRoutesList = require('./app/utils/loggerHelper').ignoreRoutesList;

// setup ConfigHelper
ConfigHelper.setup();

// get useful parameters from Configuration
const port = process.env.PORT || ConfigHelper.config.get('server.port')
const bindAddress = ConfigHelper.config.get('server.bind-address');
const mongoDBUri = ConfigHelper.config.get('dbConnection');

// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger({
    winstonInstance: LogHelper,
    ignoreRoute: function (req, res) {
        return ignoreRoutesList(req, res, ['/documentation', '/public']);
    }
}));
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

// use cors for Cross-Origin Resource Sharing
app.use(cors());

// connect to the database
mongoose.connect(mongoDBUri, {
    useNewUrlParser: true
});

// use bodyParser to grab info from a json
app.use(bodyParser.json({
    limit: '50mb'
}));
// use bodyParser to grab info from a form
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// register routes
app.use(require('./app/routes'));

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
    winstonInstance: LogHelper
}));

// create and start the server
const server = http.createServer(app);
server.listen(port, bindAddress, () => {
    LogHelper.info(`App listening on ${bindAddress}:${port}`);
    app.emit("server_started");
});

module.exports = {
    app: app,
    server: server
};