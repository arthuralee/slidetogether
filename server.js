// include the HTTP node module
var http = require('http');
var express = require('express');

// initialize express
var app = express();

app.use(express.static(__dirname + '/static'));

// Bind the server to listen on port 8080
var server = app.listen(80);
var io = require('socket.io').listen(server);

var game = {};
var userCount = 0;
var users = [];
var dir = {
  UP: 0,
  RIGHT: 1,
  LEFT: 2,
  DOWN: 3
};
game.move = function(d) {
  switch(d) {
    case 0:
      //console.log('up');
      if (game.pos.y < game.height - 1) {
        game.board[game.pos.y][game.pos.x] = game.board[game.pos.y+1][game.pos.x];
        game.board[game.pos.y+1][game.pos.x] = -1;
        game.pos.y++;
      }
      break;
    case 1:
      //console.log('right');
      if (game.pos.x > 0) {
        game.board[game.pos.y][game.pos.x] = game.board[game.pos.y][game.pos.x-1];
        game.board[game.pos.y][game.pos.x-1] = -1;
        game.pos.x--;
      }
      break;
    case 2:
      //console.log('left');
      if (game.pos.x < game.width - 1) {
        game.board[game.pos.y][game.pos.x] = game.board[game.pos.y][game.pos.x+1];
        game.board[game.pos.y][game.pos.x+1] = -1;
        game.pos.x++;
      }
      break;
    case 3:
      //console.log('down');
      if (game.pos.y > 0) {
        game.board[game.pos.y][game.pos.x] = game.board[game.pos.y-1][game.pos.x];
        game.board[game.pos.y-1][game.pos.x] = -1;
        game.pos.y--;
      }
      break;
  }
}

io.sockets.on('connection', function(socket) {
  userCount++;
  io.sockets.emit('count', {
    count: userCount
  });

  socket.on('init', function (data) {
    var returnData = {};
    if (userCount === 1) { // first user
      game.board = data.board;
      game.pos = data.pos;
      game.height = data.height;
      game.width = data.width;
    }
    returnData.game = game;
    returnData.userId = userCount;
    socket.emit('init', returnData);
  });

  socket.on('move', function(data) {
    game.move(data.dir);
    io.sockets.emit('move', {game: game});
  });

  socket.on('disconnect', function () {
    userCount--;
    io.sockets.emit('count', {
      count: userCount
    });
  });
});

