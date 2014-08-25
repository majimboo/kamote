'use strict';

var net = require('net');
var util = require('util');

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
    var methods = Object.keys(this.methods).join('\x00');
    socket.write(methods);

    socket.on('data', this.onCall.bind(this, socket));
};

Server.prototype.onCall = function(socket, request) {
    request = request.toString().split('\t');
    var methodName = request[0];
    var params = request[1].split('\x00');
    // hack: remove last empty
    params.pop();
    if (params.length) {
        // protocol
        for (var i = 0; i < params.length; i++) {
            var param = params[i].substring(1);

            // check type
            // this should be in protocol
            var type  = params[i].charCodeAt(0);
            var isError = param.indexOf('Error: ') > -1;

            if (type === 0x01) {
                params[i] = JSON.parse(param);
            }

            if (type === 0x02) {
                params[i] = param;
            }

            if (type === 0x03) {
                params[i] = this.callback.bind(socket, methodName);
            }

            if (type === 0x04) {
                params[i] = parseInt(param, 10);
            }

            if (type === 0x05) {
                params[i] = !!param;
            }

            if (type === 0x06) {
                params[i] = param;
            }

            if (isError) {
                params[i] = new Error(param.split(': ').pop());
            }
        }

        return this.methods[methodName].apply(null, params);
    }
    this.methods[methodName]();
};

Server.prototype.callback = function(methodName) {
    [].shift.apply(arguments);

    var params = '';

    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Function) {
            params += '\x03'; // function
            params += arguments[i].length;
            params += '\x00';
        }

        if (arguments[0] instanceof Error) {
            params += '\x02'; // error
            params += arguments[i];
            params += '\x00';
        }

        if (typeof arguments[i] === 'number') {
            params += '\x04'; // number
            params += arguments[i];
            params += '\x00';
        }

        if (typeof arguments[i] === 'boolean') {
            params += '\x05'; // boolean
            params += arguments[i];
            params += '\x00';
        }

        if (typeof arguments[i] === 'string') {
            params += '\x06'; // string
            params += arguments[i];
            params += '\x00';
        }

        if (typeof arguments[i] === 'object') {
            params += '\x01'; // json object
            params += JSON.stringify(arguments[i]);
            params += '\x00';
        }
    }

    // protocol ?
    // <length> <NbOfParams> <fnName> <params>

    this.write(methodName + '\t' + params);
};
