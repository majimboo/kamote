var should = require('chai').should();
var kamote = require('../');
var net = require('net');

describe('kamote-basic', function() {
    var server;
    var client;

    describe('server', function() {
        describe('#create', function() {
            it('should create a new server', function(done) {
                server = new kamote.Server();
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

        describe('#def', function() {
            it('should allow functions with callbacks', function(done) {
                function add(a, b, result) {
                    result(a + b);
                }

                server.def({
                    add: add
                });

                done();
            });
        });

    });

    describe('client', function() {
        describe('#create', function() {
            it('should create a new client', function(done) {
                client = new kamote.Client();
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
            it('should be able to call remote methods', function(done) {
                client.count();
                done();
            });

            it('should invoke callback', function(done) {
                client.add(5, 3, function(result) {
                    result.should.be.equal(8);
                    done();
                });
            });
        });
    });

});
