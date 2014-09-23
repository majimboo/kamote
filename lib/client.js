'use strict';

var _ = require('lodash');
var net = require('net');
var util = require('util');
var protocol = require('./protocol');

/**
 * @class
 */
function Client() {
  net.Socket.call(this);

  this.state = 'CLOSED';
  this.methods = [];
  this.on('connect', this.$connected);
}

util.inherits(Client, net.Socket);
module.exports = Client;

Client.prototype.reconnect = function() {
  var self = this;
  var args = arguments;
  this.connect.apply(this, args);

  this.on('error', function(error) {});
  this.on('close', function() {
    if (self.state === 'CONNECTED') {
      self.emit('disconnect');
      self.state = 'DISCONNECTED';
    }
    self.connect.apply(self, args);
  });
};

Client.prototype.$connected = function() {
  this.state = 'CONNECTED';
  this.ready = false;
  // avoids too many listeners memory leak problem
  this.removeListener('data', this.$onData);
  this.on('data', this.$onData);

  this.id = this.address().address + ':' + this.address().port;
};

Client.prototype.$onData = function(request) {
  var self = this;
  var data = protocol.decode(request);

  if (!this.ready) {
    _.each(data, function(methodName) {
      self[methodName] = self.$invoker.bind(self, methodName);
      self.methods.push(methodName);
    });

    this.emit('ready');
    this.ready = true;
  } else {
    var method = data.shift();
    if (_.indexOf(this.methods, method) > -1) {
      this[method].callback.apply(null, data);
    }
  }
};

Client.prototype.$invoker = function(methodName) {
  var self = this;
  var params = _.toArray(arguments);

  var nargs = _.map(params, function(param) {
    if (_.isFunction(param)) {
      self[methodName].callback = param;
      return 'callback:' + methodName;
    }
    return param;
  });

  var request = protocol.encode(nargs);
  var size    = new Buffer(2);
  size.writeUInt16LE(request.length + 2, 0);

  this.write(Buffer.concat([size, request]));
};
