var kamote = require('../');

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

var session = new Session();

// add a new method
function createSession(sid, data) {
    session.create(sid, data);
}

function removeSession(sid) {
    session.destroy(sid);
}

// create a new server
var server = new kamote.Server({
    createSession: createSession,
    removeSession: removeSession
});
server.listen(9455);



