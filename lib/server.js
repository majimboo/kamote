'use strict';

var net = require('net');
var util = require('util');

/**
 * @class
 */
function Server() {

}

/**
 * @export
 */
module.exports = Server;

/**
 * Start accepting connections on the specified port.
 */
Server.prototype.listen = function() {

};

/**
 * Triggers when a new client is connected.
 */
Server.prototype.onConnection = function() {
    // when connection arrives
    // send all function names being served
    // then client will create each prototype of those
};
