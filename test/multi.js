var should = require('chai').should();
var kamote = require('../');
var net = require('net');

var Session = function() {
    this.sessions = [];
};

Session.prototype.create = function(sid, data) {
    this.sessions[sid] = {};
    this.sessions[sid].data = data;
};

Session.prototype.destroy = function(sid) {
    delete this.sessions[sid];
};

describe('kamote-mutli', function() {
    it('should create new sessions from multiple remote process', function(done) {
        // new session service
        var session = new Session();

        // create a new server
        var server = new kamote.Server();
        server.listen(8787);

        // add a new method
        server.add('create', function(sid, data) {
            session.create(sid, data);

            if (data === 'chA') {
                session.sessions[sid].data.should.equal('chA');
            }

            if (data === 'chB') {
                session.sessions[sid].data.should.equal('chB');
            }

            if (session.sessions.length >= 2) {
                clientA.destroy();
                clientB.destroy();
                server.close();
                done();
            }
        });

        // create a new clientA
        var clientA = new kamote.Client();
        clientA.connect(8787);

        // create a new clientA
        var clientB = new kamote.Client();
        clientB.connect(8787);

        // call remote function
        clientA.on('ready', function() {
            clientA.create(0, 'chA');
        });

        // call remote function
        clientB.on('ready', function() {
            clientB.create(1, 'chB');
        });
    });
});
