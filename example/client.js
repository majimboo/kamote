var kamote = require('../');

// create a new client
var client = new kamote.Client();
client.reconnect(9455);

// call remote function
client.on('ready', function() {
    client.createSession(1, 'hello world');
});

client.on('connect', function() {
    console.log('connected');
});

client.on('disconnect', function() {
    console.log('disconnected');
});
