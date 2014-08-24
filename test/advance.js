var should = require('chai').should();
var kamote = require('../');
var net = require('net');

var Session = function() {
    this.sessions = {};
};

Session.prototype.create = function(sid, data) {
    this.sessions[sid] = {};
    this.sessions[sid].data = data;
};

Session.prototype.destroy = function(sid) {
    delete this.sessions[sid];
};

describe('kamote-advance', function() {
    it('should create new sessions from remote process', function(done) {
        // new session service
        var session = new Session();

        // create a new server
        var server = kamote.Server.create();
        server.listen(7778);

        // add a new method
        server.add('create', function(sid, data) {
            session.create(sid, data);
            session.sessions[sid].data.should.equal('ch');
            client.destroy();
            server.close();
            done();
        });

        // create a new client
        var client = kamote.Client.create();
        client.connect(7778);

        // call remote function
        client.on('ready', function() {
            client.create(1, 'ch');
        });
    });
});
