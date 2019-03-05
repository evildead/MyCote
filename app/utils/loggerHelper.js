const winston = require('winston');
const ConfigHelper = require('./ConfigHelper');

/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
require('winston-mongodb').MongoDB;

let logger = null;

function setupLogger() {
    if(logger) {
        return logger;
    }

    const logLevelConsole = ConfigHelper.config.get('logHelper.logLevelConsole');
    const logLevelMongoDB = ConfigHelper.config.get('logHelper.logLevelMongoDB');
    const logLevelFile = ConfigHelper.config.get('logHelper.logLevelFile');

    let logToDBEnabled = true;
    let logToConsoleEnabled = true;
    let logToFileEnabled = false;
    const loggerTransports = [];

    if(ConfigHelper.config.has('logHelper.enableDatabase')) {
        logToDBEnabled = ConfigHelper.config.get('logHelper.enableDatabase');
    }
    if(ConfigHelper.config.has('logHelper.enableConsole')) {
        logToConsoleEnabled = ConfigHelper.config.get('logHelper.enableConsole');
    }
    if(ConfigHelper.config.has('logHelper.enableFile')) {
        logToFileEnabled = ConfigHelper.config.get('logHelper.enableFile');
    }

    if(logToConsoleEnabled) {
        loggerTransports.push(
            new winston.transports.Console({
                level: logLevelConsole
            })
        );
    }

    if(logToDBEnabled) {
        loggerTransports.push(
            new winston.transports.MongoDB({
                level: logLevelMongoDB,
                db: ConfigHelper.config.get('dbConnection'),
                collection: 'logs',
                options: {
                    poolSize: 2,
                    autoReconnect: true,
                    useNewUrlParser: true
                }
            })
        );
    }

    if(logToFileEnabled) {
        loggerTransports.push(
            new winston.transports.File({
                level: logLevelFile,
                filename: 'winstonLogs.log'
            })
        );
    }

    logger = winston.createLogger({
        levels: winston.config.npm.levels,
        format: winston.format.json(),
        transports: loggerTransports
    });

    return logger;
}

/*  LOGGER EXAMPLES
    app.logger.trace('testing');
    app.logger.debug('testing');
    app.logger.info('testing');
    app.logger.warn('testing');
    app.logger.crit('testing');
    app.logger.fatal('testing');
*/

function ignoreRoutesList(req, res, routesList) {
    let myResponse = false;
    let urlsToIgnore = routesList;
    let currentUrl = req.originalUrl || req.url;

    urlsToIgnore.forEach(function(element) {
        if(currentUrl.startsWith(element)) {
            myResponse = true;
        }
    });

    return myResponse;
}

module.exports = {
    logger: setupLogger(),
    setup: setupLogger,
    ignoreRoutesList: ignoreRoutesList
};