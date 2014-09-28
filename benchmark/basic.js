'use strict';

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

var kamote  = require('../');

// kamote rcp server
var controller = {
  plusOne: function(value, result) {
    result(value + 1);
  }
};
var server = new kamote.Server();
server.def(controller);
server.listen(9456);

var kclient = new kamote.Client();
kclient.connect(9456);

kclient.on('ready', function() {

  // add tests
  suite

  .add('kamote', function() {
    kclient.plusOne(11, function(result) {

    });
  })

  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    process.kill();
  })
  // run async
  .run({ 'async': true });

});
