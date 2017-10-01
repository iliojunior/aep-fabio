var map, player, layer_terreno, cursors, placarPontuacao;
var pontuacao = 0;
var na_escada = false;

var game = new Phaser.Game(
  '100%',
  '100%',
  Phaser.CANVAS,
  'Game Demo',
  { preload: preload, create: create, update: update }
)

function preload() {
  game.load.tilemap('map', 'map/fase1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles_32x32', 'map/tiles_32x32.png');
  game.load.image('player', 'img/TOMELIROLA.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#0989b5';

  placarPontuacao = game.add.text(5, 5, pontuacao.toString(), { fill: '#ffffff', font: '14pt Arial' });
  placarPontuacao.fixedToCamera = true;

  map = game.add.tilemap('map');
  map.addTilesetImage('tiles_32x32');

  layer_terreno = map.createLayer('terreno');
  layer_terreno.resizeWorld();

  map.setCollisionBetween(0, 35);
  map.setCollision(57);

  player = game.add.sprite(100, 200, 'player');
  game.physics.enable(player);

  player.body.bounce.set(0.3);
  player.width = 25;
  player.height = 30;
  player.body.collideWorldBounds = true;

  game.camera.follow(player);
  game.physics.arcade.gravity.y = 500;

  cursors = game.input.keyboard.createCursorKeys();

  map.setTileIndexCallback(45, hitEscada, this);
  map.setTileIndexCallback(51, hitMoeda, this);
  map.setTileIndexCallback(52, hitMonstro, this);
}

function hitMonstro(sprite, monstroObject) {
  pontuacao--;
  placarPontuacao.setText(pontuacao);
  map.removeTile(monstroObject.x, monstroObject.y);
}

function hitMoeda(sprite, moedaObject) {
  pontuacao++;
  placarPontuacao.setText(pontuacao);
  map.removeTile(moedaObject.x, moedaObject.y);
}

function hitEscada(sprite, escadaObject) {
  na_escada = true;
}

function update() {
  player.body.velocity.x = 0;
  game.physics.arcade.gravity.y = 500;
  game.physics.arcade.collide(player, layer_terreno);

  if (cursors.up.isDown && (player.body.onFloor() || na_escada)) {
    player.body.velocity.y = -300;
  }

  if (cursors.down.isDown)
    player.body.velocity.y = 300;

  if (na_escada)
    game.physics.arcade.gravity.y = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -150;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 450;
  }

  na_escada = false;
}
