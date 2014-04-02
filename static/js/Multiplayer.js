var Multiplayer = function(game) {
  this.game = game;
  this.init();
};

Multiplayer.prototype.init = function() {
  var _this = this;

  this.socket = io.connect('/');
  this.socket.emit('init', {
    board: _this.game.board,
    pos: _this.game.pos,
    height: _this.game.height,
    width: _this.game.width
  });
  this.socket.on('init', function(data) {
    _this.game.board = data.game.board;
    _this.game.pos = data.game.pos;
    _this.game.height = data.game.height;
    _this.game.width = data.game.width;
    _this.game.updateScreen();
  });
  this.socket.on('count', function(data) {
    console.log(data.count, 'players connected');
  });
  this.socket.on('move', function(data) {
    console.log(data);
    _this.game.board = data.game.board;
    _this.game.pos = data.game.pos;
    _this.game.updateScreen();
  });

  $('body').unbind('keyup'); // remove existing events
  $('body').on('keyup', function(e) {
    if (game.gameOver) return;
    e.preventDefault();

    switch(e.keyCode) {
      case 38:
        this.move(dir.UP);
        break;
      case 39:
        this.move(dir.RIGHT);
        break;
      case 37:
        this.move(dir.LEFT);
        break;
      case 40:
        this.move(dir.DOWN);
        break;
    }
  }.bind(this));
}

Multiplayer.prototype.move = function(d) {
  this.socket.emit('move', {dir: d});
}