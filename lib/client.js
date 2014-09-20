'use strict';

var net = require('net');
var util = require('util');
var protocol = require('./protocol');

/**
 * @class
 */
function Client() {
    net.Socket.call(this);

    this.state = 'CLOSED';
    this.on('connect', this.connected);
}

util.inherits(Client, net.Socket);
module.exports = Client;

Client.prototype.reconnect = function() {
    var self = this;
    var args = arguments;
    this.connect.apply(this, args);

    this.on('error', function(error) {});
    this.on('close', function() {
        if (self.state === 'CONNECTED') {
            self.emit('disconnect');
            self.state = 'DISCONNECTED';
        }
        self.connect.apply(self, args);
    });
};

Client.prototype.connected = function() {
    this.state = 'CONNECTED';
    this.removeListener('data', this.onData);
    this.on('data', this.onData);

    this.id = this.address().address + ':' + this.address().port;
};

Client.prototype.onData = function(methods) {
    var self = this;

    methods = protocol.decode(methods);
    methods.forEach(function(methodName) {
        self[methodName] = this.caller.bind(this, methodName);
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
