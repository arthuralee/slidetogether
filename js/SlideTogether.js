var dir = {
  UP: 0,
  RIGHT: 1,
  LEFT: 2,
  DOWN: 3
};

SlideTogether = function(options) {
  // set options
  for (option in options) {
    this[option] = options[option];
  }
  this.length = this.width * this.height - 1;
  this.init();
  this.updateScreen();
  this.gameOver = false;
};

SlideTogether.prototype.init = function() {
  // generate random board
  var array = [];
  for (var i = 0; i<this.length; i++) {
    array[i] = i;
  }
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  array.push(-1);
  this.board = partition(array, this.width);
  this.pos = {x:this.width-1,y:this.height-1};

  // Initialize CSS
  this.node.css({
    width: this.cellWidth * this.width,
    height: this.cellHeight * this.height
  });
  this.nodes = [];
  for(var i=0; i<this.length; i++) {
    this.nodes[i] = $('<div>').addClass('piece');
    this.nodes[i].html(i);
    this.nodes[i].css({
      width: this.cellWidth,
      height: this.cellHeight,
      backgroundImage: 'url(' + this.img + ')',
      backgroundSize: this.cellWidth*this.width + 'px ' + this.cellHeight*this.height + 'px',
      backgroundPosition: -this.cellWidth*(i%this.width) + 'px ' + -this.cellHeight*(Math.floor(i/this.height)) + 'px'
    });
    this.node.append(this.nodes[i]);
  }

  // Bind events
  $('body').on('keyup', function(e) {
    if (this.gameOver) return;

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
    this.updateScreen();
  }.bind(this));
};

SlideTogether.prototype.move = function(d) {
  switch(d) {
    case 0:
      //console.log('up');
      if (this.pos.y < this.height - 1) {
        this.board[this.pos.y][this.pos.x] = this.board[this.pos.y+1][this.pos.x];
        this.board[this.pos.y+1][this.pos.x] = -1;
        this.pos.y++;
      }
      break;
    case 1:
      //console.log('right');
      if (this.pos.x > 0) {
        this.board[this.pos.y][this.pos.x] = this.board[this.pos.y][this.pos.x-1];
        this.board[this.pos.y][this.pos.x-1] = -1;
        this.pos.x--;
      }
      break;
    case 2:
      //console.log('left');
      if (this.pos.x < this.width - 1) {
        this.board[this.pos.y][this.pos.x] = this.board[this.pos.y][this.pos.x+1];
        this.board[this.pos.y][this.pos.x+1] = -1;
        this.pos.x++;
      }
      break;
    case 3:
      //console.log('down');
      if (this.pos.y > 0) {
        this.board[this.pos.y][this.pos.x] = this.board[this.pos.y-1][this.pos.x];
        this.board[this.pos.y-1][this.pos.x] = -1;
        this.pos.y--;
      }
      break;
  }
};

SlideTogether.prototype.updateScreen = function() {
  for(var i=0; i<this.board.length; i++) {
    for (var j=0; j<this.board[i].length; j++) {
      if (this.board[i][j] !== -1) {
        var cell = this.nodes[this.board[i][j]];
        cell.css({
          top: i*this.cellHeight,
          left: j*this.cellWidth
        });
      }
    }
  }
  this.checkWin();
};

SlideTogether.prototype.checkWin = function() {
  var win = [];
  for (var i = 0; i<this.length; i++) {
    win[i] = i;
  }
  win.push(-1);
  win = partition(win, this.width);

  if (JSON.stringify(this.board) === JSON.stringify(win)) {
    this.gameOver = true;
    alert('You win');
  }
};

/* ----------------------- */

function partition(items, size) {
  var p = [];
  for (var i=Math.floor(items.length/size); i-->0; ) {
    p[i]=items.slice(i*size, (i+1)*size);
  }
  return p;
}