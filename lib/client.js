'use strict';

var net = require('net');
var util = require('util');

/**
 * @class
 */
function Client() {
    net.Socket.call(this);

    this.callbacks = {};
    this.on('connect', this.connected);

    this.state = 'HANDSHAKE';
}

util.inherits(Client, net.Socket);
module.exports = Client;

Client.prototype.connected = function() {
    this.on('data', this.onData);
};

Client.prototype.onData = function(data) {
    data = data.toString();

    // bug on reconnection

    if (this.state === 'READY') {
        var request = data.split('\t');
        var methodName = request[0];
        var params = request[1].split('\x00');
        var callback = this.callbacks[methodName];
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

            return callback.apply(null, params);
        }
        callback();
    }

    if (this.state === 'HANDSHAKE') {
        var methods = data.split('\x00');
        methods.forEach(function (methodName) {
            Client.prototype[methodName] = this.caller.bind(this, methodName);
        }.bind(this));

        this.emit('ready');
        this.state = 'READY';
    }
};

Client.prototype.caller = function(methodName) {
    [].shift.apply(arguments);

    var params = '';

    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Function) {
            params += '\x03'; // function
            params += arguments[i].length;
            params += '\x00';
            this.callbacks[methodName] = arguments[i];
        }

        if (arguments[0] instanceof Error) {
            params += '\x02'; // others
            params += arguments[i];
            params += '\x00';
        }

        if (typeof arguments[i] === 'number') {
            params += '\x04'; // json object
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
