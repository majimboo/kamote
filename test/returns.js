var should = require('chai').should();
var kamote = require('../');
var net = require('net');

describe('kamote-returns', function() {
    it('should return the value from the remote process', function(done) {
        // create a new server
        var server = new kamote.Server();
        server.listen(9595);

        // add a new method
        server.add('plus', function(value, callback) {
            callback(value + value);
        });

        // create a new client
        var client = new kamote.Client();
        client.connect(9595);

        // call remote function
        client.on('ready', function() {
            client.plus(4, function(result) {
                result.should.equal(8);
                done();
            });
        });
    });
});
