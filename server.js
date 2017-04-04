var express = require('express');
var app = express();
var server = app.listen(8008);
app.use(express.static('public'));

//OSC
var osc = require('node-osc');
var client = new osc.Client('127.0.0.1', 8009);
var oscServer = new osc.Server(12000, '0.0.0.0');
// I need to send msg to client
oscServer.on("message", function (msg, rinfo) {
      console.log("TUIO message:");
      console.log(msg);
      io.emit('wekTrained', msg);
});

console.log("It's Alive!");

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('New Connection: ' + socket.id);

  socket.on('pegs', wekiLearn);

  function wekiLearn(data) {
    client.send('/wek/inputs', data, function() {
      //client.kill();
    });
    //socket.broadcast.emit('mouse', data);
    //console.log(data);
  }


}
