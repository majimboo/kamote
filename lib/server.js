'use strict';

var _ = require('lodash');
var net = require('net');
var util = require('util');
var protocol = require('./protocol');
var StreamFrame = require('stream-frame');

/**
 * @class
 */
function Server() {
  net.Server.call(this);

  this.methods = {};

  this.emit('ready');
  this.$ready();
}

util.inherits(Server, net.Server);
module.exports = Server;

// maybe rename to hook?
Server.prototype.add = function(name, fn) {
  if (typeof name === 'function') {
    fn = name;
    name = null;
  }

  if (name || fn.name) {
    this.methods[name || fn.name] = fn;
    return;
  }

  throw new Error('invalid function');
};

Server.prototype.def = function(context) {
  var methodKeys = Object.keys(context);

  for (var i = 0; i < methodKeys.length; i++) {
    var key = methodKeys[i];
    var fn  = context[key];

    this.add(key, fn);
  }
};

Server.prototype.$ready = function() {
  this.on('listening', this.$listening);
};

Server.prototype.$listening = function() {
  this.on('connection', this.$onConnection);
};

Server.prototype.$onConnection = function(socket) {
  this.reply = function() {
    socket.write(protocol.encode(_.toArray(arguments)));
  };

  // when connection arrives
  // send all function names being served
  // then client will create each prototype of those
  var methods = protocol.encode(Object.keys(this.methods));
  socket.write(methods);

  var B = new StreamFrame();
  B.wrap(socket);
  B.on('data', this.$invoked.bind(this));
};

Server.prototype.$invoked = function(request) {
  var self = this;

  request = protocol.decode(request.slice(2));
  var methodName = request.shift();

  var params = _.map(request, function(param) {
    if (param === 'callback:' + methodName) {
      return self.reply.bind(null, methodName);
    }
    return param;
  });

  this.methods[methodName].apply(this, params);
};
