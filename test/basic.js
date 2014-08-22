var should = require('chai').should();
var kamote = require('../');
var net = require('net');

describe('kamote-basic', function() {
    var server;
    var client;

    describe('server', function() {
        describe('#create', function() {
            it('should create a new server', function(done) {
                var Server = kamote.Server;
                server = Server.create();
                server.should.be.instanceof(net.Server);
                server.listen(7777);
                done();
            });
        });

        describe('#add', function() {
            it('should accept a named function', function(done) {
                function count() {}

                (function() {
                    server.add(count);
                }).should.not.throw();

                done();
            });

            it('should accept an anonymous function with name', function(done) {
                var count = function() {};

                (function() {
                    server.add('count', count);
                }).should.not.throw();

                done();
            });

            it('should not accept an anonymous function', function(done) {
                var count = function() {};

                (function() {
                    server.add(count);
                }).should.throw();

                done();
            });
        });
    });

    describe('client', function() {
        describe('#create', function() {
            it('should create a new client', function(done) {
                var Client = kamote.Client;
                client = Client.create();
                done();
            });
        });

        describe('#connect', function() {
             it('should receive method names from server', function(done) {
                client.connect(7777);
                done();
            });
        });

        describe('#method', function() {
            it('should be able to call methods exposed by server', function(done) {
                client.count();
                done();
            });
        });
    });

});
