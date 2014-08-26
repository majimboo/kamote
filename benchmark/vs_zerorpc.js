'use strict';

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

var zerorpc = require('zerorpc');
var kamote  = require('../');

// zero rpc server
var server = new zerorpc.Server({
    plusOne: function(value) {
        return value + 1;
    }
});
server.bind('tcp://0.0.0.0:4242');

// kamote rcp server
var server = new kamote.Server();
server.add('plusOne', function(value) {
    return value + 1;
});
server.listen(9456);

var zclient = new zerorpc.Client();
zclient.connect('tcp://127.0.0.1:4242');

var kclient = new kamote.Client();
kclient.connect(9456);

kclient.on('ready', function() {

  // add tests
  suite

  .add('kamote', function() {
    kclient.plusOne(11);
  })

  .add('zerorpc', function() {
    zclient.invoke('plusOne', 11);
  })

  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    process.kill();
  })
  // run async
  .run({ 'async': true });

});
