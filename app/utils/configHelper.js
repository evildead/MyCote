'use strict';

const config = require('config');

let configDecorated = null;

// decorator pattern
function decorate(component) {
    if(configDecorated) {
        return configDecorated;
    }

    const proto = Object.getPrototypeOf(component);

    // config decorator
    function Decorator(component) {
        this.component = component;
    }

    Decorator.prototype = Object.create(proto);

    //new method - set
    Decorator.prototype.set = function(propertyKey, propertyVal) {
        if(propertyKey === null || propertyKey === undefined || !(typeof propertyKey === 'string' || propertyKey instanceof String)) {
            throw new Error("propertyKey must be a string");
        }

        if(!this.has(propertyKey)) {
            this.component[propertyKey] = propertyVal;
        }
    };

    //new method - viewConfig
    Decorator.prototype.viewConfig = function(beautify = false) {
        let outStr;
        if(beautify) {
            outStr = JSON.stringify(this.component, null, 2);
        }
        else {
            outStr = JSON.stringify(this.component);
        }

        return outStr;
    };

    //delegated method - has
    Decorator.prototype.has = function() {
        return this.component.has.apply(this.component, arguments);
    };

    //delegated method - get
    Decorator.prototype.get = function() {
        return this.component.get.apply(this.component, arguments);
    };

    configDecorated = new Decorator(component);
    return configDecorated;
}

function setup() {

    /*
        File Load order - see https://github.com/lorenwest/node-config/wiki/Configuration-Files
        default.EXT
        default-{instance}.EXT
        {deployment}.EXT
        {deployment}-{instance}.EXT
        {short_hostname}.EXT
        {short_hostname}-{instance}.EXT
        {short_hostname}-{deployment}.EXT
        {short_hostname}-{deployment}-{instance}.EXT
        {full_hostname}.EXT
        {full_hostname}-{instance}.EXT
        {full_hostname}-{deployment}.EXT
        {full_hostname}-{deployment}-{instance}.EXT
        local.EXT
        local-{instance}.EXT
        local-{deployment}.EXT
        local-{deployment}-{instance}.EXT
        (Finally, custom environment variables can override all files)
    */

    decorate(config);
    console.log('Configuration loaded -> ', configDecorated.viewConfig(true));
}

module.exports = {
    setup : setup,
    config : decorate(config)
};