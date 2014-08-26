kamote [![Build Status](https://travis-ci.org/majimboo/kamote.svg)](https://travis-ci.org/majimboo/kamote)
======

[![NPM](https://nodei.co/npm/kamote.png?downloads=true)](https://nodei.co/npm/kamote/)

Yet another RPC for Node.

Install
-------

    $ npm install kamote --save

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


