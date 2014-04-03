// include the HTTP node module
var http = require('http');
var express = require('express');

// initialize express
var app = express();

app.use(express.static(__dirname + '/static'));

// Bind the server to listen on port 8080
var server = app.listen(8012);
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
var votes = [];
var timer = setInterval(decide,5000);

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

  socket.on('vote', function(data) {
    votes.push(data.dir);
    io.sockets.emit('vote', {
      dir: data.dir,
      nickname: data.nickname,
      game: {board: game.board, pos: game.pos}
    });
  });

  socket.on('disconnect', function () {
    userCount--;
    io.sockets.emit('count', {
      count: userCount
    });
  });
});

function decide() {
  if (votes.length === 0) return;

  var dir = mode(votes);
  console.log(votes);
  console.log(dir);

  game.move(dir);
  io.sockets.emit('move', {
    dir: dir,
    game: {board: game.board, pos: game.pos}
  });
  votes = [];
};

function mode(array)
{
  if(array.length == 0)
    return null;
  var modeMap = {};
  var maxEl = array[0], maxCount = 1;
  for(var i = 0; i < array.length; i++)
  {
    var el = array[i];
    if(modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;  
    if(modeMap[el] > maxCount)
    {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}