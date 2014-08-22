var should = require('chai').should();
var kamote = require('../');
var net = require('net');

describe('example', function() {
    it('should work with parameters', function(done) {
        // create a new server
        var server = kamote.Server.create();
        server.listen(7778);

        // add a new method
        server.add('remoteMethod', function(finish) {
            if (finish) {
                client.destroy();
                server.close();
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

    it('should work with errors in parameters', function(done) {
        // create a new server
        var server = kamote.Server.create();
        server.listen(7778);

        // add a new method
        server.add('remoteMethod', function(err) {
            client.destroy();
            server.close();
            err.should.be.instanceof(Error);
            done();
        });

        // create a new client
        var client = kamote.Client.create();
        client.connect(7778);

        // call remote function
        client.on('ready', function() {
            client.remoteMethod(new Error('some error'));
        });
    });

    it('should work without parameters', function(done) {
        // create a new server
        var server = kamote.Server.create();
        server.listen(7778);

        // add a new method
        server.add('remoteMethod', done);

        // create a new client
        var client = kamote.Client.create();
        client.connect(7778);

        // call remote function
        client.on('ready', function() {
            client.remoteMethod();
        });
    });
});
