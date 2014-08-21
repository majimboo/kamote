'use strict';

var protocol = require('./protocol');
var Server = require('./server');
var Client = require('./client');

function createServer(opts) {
    opts = opts || {};

    var server = new Server();
    server.listen();

    return server;
}

function createClient(opts) {
    opts = opts || {};

    var client = new Client();
    client.connect();

    return client;
}
