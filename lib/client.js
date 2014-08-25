'use strict';

var net = require('net');
var util = require('util');

/**
 * @class
 */
function Client() {
    net.Socket.call(this);

    this.on('connect', this.connected);
}

util.inherits(Client, net.Socket);
module.exports = Client;

Client.prototype.connected = function() {
    this.on('data', this.onData);
};

Client.prototype.onData = function(data) {
    data = data.toString();
    var methods = data.split('\x00');

    methods.forEach(function (methodName) {
        Client.prototype[methodName] = this.caller.bind(this, methodName);
    }.bind(this));

    this.emit('ready');
};

Client.prototype.caller = function(methodName) {
    [].shift.apply(arguments);

    var params = '';

    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'object' && !(arguments[0] instanceof Error)) {
            params += '\x01'; // json
            params += JSON.stringify(arguments[i]);
            params += '\x00';
        } else {
            params += '\x02'; // others
            params += arguments[i];
            params += '\x00';
        }
    }

    // protocol ?
    // <length> <NbOfParams> <fnName> <params>

    this.write(methodName + '\t' + params);
};
