'use strict';

var game = new Phaser.Game(
  '100%',
  '100%',
  Phaser.CANVAS,
  'Game AEP',
  {
    preload: preload,
    create: create,
    update: update
  }
);

var myPlayer;
var otherPlayer;
var finalDaTela;
var meusTiros = [];
var otherTiros = [];
var textVidaOtherPlayer;
var textVidaMyPlayer;
var textoWin;

var tiroHeight = 8;
var tiroWidth = tiroHeight * 2;

var vidaMyPlayer = 100;
var vidaOtherPlayer = 100;

var danoTiro = 5;

var win = false;

var styleVidas = {font: "bold 18px Arial", fill: "yellow", boundsAlignH: "center", boundsAlignV: "middle"};

function preload() {
  game.load.image('background', 'img/background.png');
  game.load.image('spaceship', 'img/spaceship.png');
  game.load.image('laser-blue', 'img/laser-blue.png');
  game.load.image('laser-red', 'img/laser-red.png');
  game.time.fps = 120;
}

function create() {
  game.add.sprite(0, 0, 'background');

  finalDaTela = game.world.height - 37;
  var widthSpaceship = 40;
  var heightSpaceship = 35;

  myPlayer = game.add.sprite(game.world.centerX - 20, finalDaTela, 'spaceship');
  myPlayer.height = heightSpaceship;
  myPlayer.width = widthSpaceship;
  myPlayer.inputEnabled = true;
  myPlayer.atirando = false;

  otherPlayer = game.add.sprite(game.world.centerX, 2, 'spaceship');
  otherPlayer.height = heightSpaceship;
  otherPlayer.width = widthSpaceship;
  otherPlayer.angle = 180;
  otherPlayer.anchor.setTo(0.5, 0.5);

  game.physics.enable(myPlayer, Phaser.Physics.ARCADE);
  game.physics.enable(otherPlayer, Phaser.Physics.ARCADE);

  myPlayer.body.collideWorldBounds = true;
  otherPlayer.body.collideWorldBounds = true;

  myPlayer.events.onInputDown.add(atirar, this);

  textVidaOtherPlayer = game.add.text(0, 0, vidaOtherPlayer.toString(), styleVidas);
  textVidaMyPlayer = game.add.text(0, finalDaTela + 18, vidaMyPlayer.toString(), styleVidas);

  otherPlayerCalcularAtirar();
}

function update() {

  if (game.input.pointer1.isDown && !myPlayer.atirando && !win) {
    if (game.input.activePointer.x > game.width / 2)
      moverPlayerParaDireita();
    else if (game.input.activePointer.x < game.width / 2)
      moverPlayerParaEsquerda();
  } else if (game.input.pointer1.isUp)
    myPlayer.atirando = false;

  if (meusTiros.length && !win) {
    for (var i = 0; i < meusTiros.length; i++) {
      var item = meusTiros[i];
      item.y -= 10;
      if (item.overlap(otherPlayer)) {
        destruirTiro(item, i, meusTiros);
        acertouOhterPlayer();
      } else if (item.y <= (tiroWidth * -1))
        destruirTiro(item, i, meusTiros);
    }
  }

  if (otherTiros.length && !win) {
    for (var i2 = 0; i2 < otherTiros.length; i2++) {
      var item2 = otherTiros[i2];
      item2.y += 10;
      if (item2.overlap(myPlayer)) {
        destruirTiro(item2, i2, otherTiros);
        acertouMyPlayer();
      } else if (item2.y <= (tiroWidth * -1))
        destruirTiro(item2, i2, otherTiros);
    }
  }
}

function criarOtherPlayerAtirar() {
  var novoTiro = game.add.sprite(otherPlayer.x, tiroWidth, 'laser-red');
  novoTiro.height = tiroHeight;
  novoTiro.width = tiroWidth;
  novoTiro.anchor.setTo(0.5, 0.5);
  novoTiro.angle = 90;
  game.physics.enable(novoTiro, Phaser.Physics.ARCADE);

  otherTiros.push(novoTiro);
}

function otherPlayerCalcularAtirar() {
  var time = Math.floor((Math.random() * 1000) + 1);
  setTimeout(function () {
    criarOtherPlayerAtirar();
    otherPlayerCalcularAtirar()
  }, time);
}

function atualizarVidaOtherPlayer() {
  textVidaOtherPlayer.setText(vidaOtherPlayer.toString());
}

function atualizarVidaMyPlayer() {
  textVidaMyPlayer.setText(vidaMyPlayer.toString());
}

function youWin() {
  win = true;
  var style = {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};

  textoWin = game.add.text(120, finalDaTela / 2, "You win!", style);
  setTimeout(function () {
    restartGame()
  }, 2000);
}

function restartGame() {
  window.location.reload(true);
}

function youLose() {
  win = true;
  var style = {font: "bold 32px Arial", fill: "red", boundsAlignH: "center", boundsAlignV: "middle"};

  textoWin = game.add.text(120, finalDaTela / 2, "You Lose!", style);
  setTimeout(function () {
    restartGame()
  }, 2000);
}

function acertouMyPlayer() {
  var result = vidaMyPlayer - danoTiro;
  if (result <= 0) {
    vidaMyPlayer = 0;
    youLose();
  } else {
    vidaMyPlayer = result;
  }
  atualizarVidaMyPlayer();
}

function acertouOhterPlayer() {
  var result = vidaOtherPlayer - danoTiro;
  if (result <= 0) {
    vidaOtherPlayer = 0;
    youWin();
  } else {
    vidaOtherPlayer = result;
  }
  atualizarVidaOtherPlayer();
  otherPlayer.x = game.world.randomX;
}

function somExplosao() {

}

function destruirTiro(tiro, posicao, array) {
  tiro.destroy();
  array.splice(posicao, 1);
}

function moverPlayerParaDireita() {
  myPlayer.x += 10;
}

function moverPlayerParaEsquerda() {
  myPlayer.x -= 10;
}

function atirar(spritePlayer, pointer) {
  myPlayer.atirando = true;
  criarMeuTiro();
}

function criarMeuTiro() {
  var meuNovoTiro = game.add.sprite(myPlayer.x + myPlayer.width / 2, finalDaTela + tiroWidth, 'laser-blue');
  meuNovoTiro.height = tiroHeight;
  meuNovoTiro.width = tiroWidth;
  meuNovoTiro.anchor.setTo(0.5, 0.5);
  meuNovoTiro.angle = 90;
  game.physics.enable(meuNovoTiro, Phaser.Physics.ARCADE);

  meusTiros.push(meuNovoTiro);
}
