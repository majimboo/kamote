'use strict';

var msgpack = require('msgpack-js');

module.exports.encode = msgpack.encode;
module.exports.decode = msgpack.decode;
