kamote [![Build Status](https://travis-ci.org/majimboo/kamote.svg)](https://travis-ci.org/majimboo/kamote)
======

[![NPM](https://nodei.co/npm/kamote.png?downloads=true)](https://nodei.co/npm/kamote/)

A simple, fast RPC for Node.

Install
-------

    $ npm install kamote --save

Installing the latest version

    $ npm install git+https://github.com/majimboo/kamote.git

Server
------

To create a new server:

    var kamote = require('kamote');
    var server = new kamote.Server();

Events:

- `error` - When an error occurs.

Methods:

- `add([name, ]function)` - Adds a function to be exposed over RPC.
- `listen(port[, host]` - Binds the server to the specified endpoint.

Full example:

    var kamote = require('kamote');
    var server = new kamote.Server();

    server.add('plusOne', function(value) {
        console.log(value + 1);
    });

    server.listen(9456);

You can also use the context style:

    function plusOne(value) {
        console.log(value + 1);
    }

    var server = new kamote.Server({
        plusOne: plusOne
    }).listen(9456);

Client
------

To create a new client:

    var kamote = require('kamote');
    var client = new kamote.Client();

Events:

- `error` - When an error occurs.
- `connect` - When the socket has connected to the server.
- `disconnect` - When disconnected from the server.
- `ready` - When all the remote functions has been loaded.

Methods:

- `connect(port [, host])` - Connects to the remote host:port.
- `reconnect(port [, host])` - Connects to the remote host:port and retries if unable.

Full example:

    var kamote = require('kamote');
    var server = new kamote.Server();

    client.plusOne(100);

    client.reconnect(9456);

Todo
----

- Support callbacks.
- Support returns.
- Support node objects like Errors.
