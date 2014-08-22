'use strict';

var net = require('net');
var util = require('util');

function create() {
    return new Client();
}

/**
 * @export
 */
module.exports.create = create;


/**
 * @class
 */
function Client() {
    net.Socket.call(this);

    this.on('connect', this.connected);
}

util.inherits(Client, net.Socket);

Client.prototype.connected = function() {
    this.on('data', this.onData);
};

Client.prototype.onData = function(data) {
    data = data.toString();
    var methods = data.split('\x00');

    methods.forEach(function (method) {
        Client.prototype[method] = this.caller.bind(this, method);
    }.bind(this));

    this.emit('ready');
};

Client.prototype.caller = function(name) {
    this.write(name);
};
