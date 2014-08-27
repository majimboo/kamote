var should = require('chai').should();
var kamote = require('../');
var net = require('net');

describe('kamote-reconnect', function() {
    it('should keep retrying until able to connect', function(done) {
        // create a new client
        var client = new kamote.Client();
        client.reconnect(7345);

        client.on('connect', function() {
            done();
        });

        // create a new server
        var server = new kamote.Server();
        // tried to delay this with setTimeout and it works
        // but removed it just to make the test faster
        server.listen(7345);
    });

    it('should emit disconnect when disconnected', function(done) {
        // create a new client
        var client = new kamote.Client();
        client.reconnect(5126);

        client.on('disconnect', function() {
            done();
        });

        client.on('connect', function() {
            failserve.close();
        });

        // create a new server
        var failserve = new kamote.Server();
        // tried to delay this with setTimeout and it works
        // but removed it just to make the test faster
        failserve.listen(5126);
    });
});
