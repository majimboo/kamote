var kamote = require('../');

// create a new server
var server = new kamote.Server();
server.listen(9455);

// add a new method
server.add('remoteMethod', function(finish) {
    console.log(finish);
});


