var Multiplayer = function(game, nickname) {
  this.game = game;
  this.nickname = nickname;
  this.voted = false;
  this.init();
};

Multiplayer.prototype.init = function() {
  var _this = this;

  this.socket = io.connect('/');
  this.socket.emit('init', {
    board: _this.game.board,
    pos: _this.game.pos,
    height: _this.game.height,
    width: _this.game.width,
    nickname: _this.game.nickname
  });
  this.socket.on('init', function(data) {
    _this.game.board = data.game.board;
    _this.game.pos = data.game.pos;
    _this.game.height = data.game.height;
    _this.game.width = data.game.width;
    _this.game.updateScreen();
  });
  this.socket.on('count', function(data) {
    $('#count').html(data.count);
    if (data.count > 1) {
      $('#plural').html('s');
    } else {
      $('#plural').html('');
    }
  });
  this.socket.on('move', function(data) {
    var li = $('<li>');
    var map = ['&#8673','&#8674','&#8672','&#8675'];
    li.html('moving ' + map[data.dir]);
    li.addClass('move')
    li.hide();
    $('.log').prepend(li);
    li.slideDown();

    _this.game.board = data.game.board;
    _this.game.pos = data.game.pos;
    _this.game.updateScreen();
    _this.voted = false;
  });
  this.socket.on('vote', function(data) {
    var li = $('<li>');
    var map = ['&#8673','&#8674','&#8672','&#8675'];
    li.html(data.nickname + ' voted ' + map[data.dir]);
    li.hide();
    $('.log').prepend(li);
    li.slideDown();
  });

  $('body').unbind('keyup'); // remove existing events
  $('body').on('keyup', function(e) {
    if (_this.game.gameOver) return;
    e.preventDefault();

    switch(e.keyCode) {
      case 38:
        this.vote(dir.UP);
        break;
      case 39:
        this.vote(dir.RIGHT);
        break;
      case 37:
        this.vote(dir.LEFT);
        break;
      case 40:
        this.vote(dir.DOWN);
        break;
    }
  }.bind(this));
}

Multiplayer.prototype.vote = function(d) {
  if (this.voted) return;
  this.voted = true;
  this.socket.emit('vote', {dir: d, nickname: this.nickname});
}