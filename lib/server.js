'use strict';

var net = require('net');
var util = require('util');
var protocol = require('./protocol');

/**
 * @class
 */
function Server() {
   net.Server.call(this);

   this.methods = {};

   this.ready();
}

util.inherits(Server, net.Server);
module.exports = Server;

Server.prototype.add = function(name, fn) {
    if (typeof name === 'function') {
        fn = name;
        name = null;
    }

    if (name || fn.name) {
        this.methods[name || fn.name] = fn;
        return;
    }

    throw new Error('invalid function');
};


Server.prototype.ready = function() {
    this.on('listening', this.listening);
};

Server.prototype.listening = function() {
    this.on('connection', this.onConnection);
};

Server.prototype.onConnection = function(socket) {
    // when connection arrives
    // send all function names being served
    // then client will create each prototype of those
    var methods = protocol.encode(Object.keys(this.methods));
    socket.write(methods);
    socket.on('data', this.onCall.bind(this, socket));
};

Server.prototype.onCall = function(socket, request) {
    request = protocol.decode(request);
    var methodName = request[0];
    var params = [];

    var keys = Object.keys(request);

    for (var i = 1; i < keys.length; i++) {
        var key = keys[i];
        params.push(request[key]);
    }

    this.methods[methodName].apply(null, params);
};
