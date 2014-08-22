var should = require('chai').should();
var kamote = require('../');
var net = require('net');

describe('example', function() {
    it('should work as expected', function(done) {
        // create a new server
        var server = kamote.Server.create();
        server.listen(7778);

        // add a new method
        server.add('remoteMethod', function(finish) {
            if (finish) {
                done();
            }
        });

        // create a new client
        var client = kamote.Client.create();
        client.connect(7778);

        // call remote function
        client.on('ready', function() {
            client.remoteMethod(true);
        });
    });
});
