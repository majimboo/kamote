'use strict';

var msgpack = require('msgpack');

module.exports.encode = msgpack.pack;
module.exports.decode = msgpack.unpack;
