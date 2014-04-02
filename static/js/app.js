var game = new SlideTogether({
  node: $('#board'),
  img: 'img/doge.jpg',
  cellWidth: 150,
  cellHeight: 150,
  width: 3,
  height: 3
});

var mGame = new Multiplayer(game);