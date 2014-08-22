'use strict';

var net = require('net');
var util = require('util');

function create() {
    return new Server();
}

/**
 * @export
 */
module.exports.create = create;

/**
 * @class
 */
function Server() {
   net.Server.call(this);

   this.methods = {};

   this.ready();
}

util.inherits(Server, net.Server);

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
    var methods = Object.keys(this.methods).join('\x00');
    socket.write(methods);

    socket.on('data', this.onCall.bind(this));
};

Server.prototype.onCall = function(request) {
    request = request.toString().split('\x00');
    var name = request[0];
    var params = request[1];
    if (params !== 'undefined') {
        return this.methods[name](params);
    }
    this.methods[name]();
};
