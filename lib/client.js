'use strict';

var net = require('net');
var util = require('util');
var protocol = require('./protocol');

/**
 * @class
 */
function Client() {
    net.Socket.call(this);

    this.on('connect', this.connected);
}

util.inherits(Client, net.Socket);
module.exports = Client;

Client.prototype.reconnect = function() {
    var _this = this;
    var args = arguments;
    this.connect.apply(this, args);

    this.on('error', function(error) {});
    this.on('close', function() {
        _this.connect.apply(_this, args);
    });
};

Client.prototype.connected = function() {
    this.on('data', this.onData);
};

Client.prototype.onData = function(methods) {
    methods = protocol.decode(methods);

    methods.forEach(function (methodName) {
        Client.prototype[methodName] = this.caller.bind(this, methodName);
    }.bind(this));

    this.emit('ready');
};

Client.prototype.caller = function(methodName) {
    var request = protocol.encode(arguments);
    var size    = new Buffer(2);
    size.writeUInt16LE(request.length + 2, 0);
    var newBuffer = Buffer.concat([size, request]);

    this.write(newBuffer);
};
