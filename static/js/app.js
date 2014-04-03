$(document).ready(function() {
  var game = new SlideTogether({
    node: $('#board'),
    img: 'img/doge.jpg',
    cellWidth: 150,
    cellHeight: 150,
    width: 3,
    height: 3
  });

  var nickname = window.prompt('Please choose a nickname').substr(0,15);
  var mGame = new Multiplayer(game, nickname);
});