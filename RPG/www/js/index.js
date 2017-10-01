var width = window.innerWidth;
var heigth = window.innerHeight;

var player, monster, cursors, txtScore, txtSeconds, score, music, ping;

var timeStart;

var game = new Phaser.Game(
    '100%',
    '100%',
    Phaser.CANVAS,
    'Game Demo',
    { preload: preload, create: create, update: update }
);

function preload() {
    game.load.image('monster', 'img/monster.png');
    game.load.image('background', 'img/bg.jpg');
    game.load.spritesheet('player', 'img/gravitation_yuki.png', 32, 48);
    game.time.fps = 60;

    game.load.audio('music', 'music/music1.mp3');
    game.load.audio('ping', 'sound/ping.mp3');
}

function create() {
    timeStart = new Date().getTime();
    music = game.sound.play('music');
    music.volume = 1;
    music.loopFull();

    game.world.resize(2000, 2000);

    game.add.sprite(0, 0, 'background');

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    game.camera.follow(player);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.setTo(0.5, 0);
    player.body.collideWorldBounds = true;

    player.animations.add('walkDown', [0, 1, 2, 3]);
    player.animations.add('walkLeft', [4, 5, 6, 7]);
    player.animations.add('walkRight', [8, 9, 10, 11]);
    player.animations.add('walkUp', [12, 13, 14, 15]);

    monster = game.add.group();
    monster.enableBody = true;

    for (var i = 0; i < 10; i++) {
        var randomX = game.world.randomX;
        var randomY = game.world.randomY;
        var theMonster = monster.create(randomX, randomY, 'monster');
        var styleName = { font: '15px Arial', fill: '#fff' };
        var text = game.add.text(randomX, randomY, (i + 1).toString(), styleName);

        theMonster.theName = text;
        theMonster.body.collideWorldBounds = true;
        theMonster.width = 65;
        theMonster.height = 65;
    }

    game.physics.enable(monster, Phaser.Physics.ARCADE);

    score = 0;


    var style = { font: '25px Arial', fill: '#bddb28' };
    txtSeconds = game.add.text(10, game.height - 35, getTimeLapsed(), style);
    txtSeconds.fixedToCamera = true;

    txtScore = game.add.text(10, 10, score.toString(), style);
    txtScore.fixedToCamera = true;
    cursors = game.input.keyboard.createCursorKeys();
}

function getTimeLapsed() {
    var atual = new Date().getTime();
    return parseInt((atual - timeStart) / 1000) + " sec";
}

function update() {

    if (monster.children.length == 0)
        return;

    if (cursors.left.isDown) {
        player.animations.play('walkLeft', 5, true);
        player.x -= 5;
    } else if (cursors.right.isDown) {
        player.animations.play('walkRight', 5, true);
        player.x += 5;
    } else if (cursors.up.isDown) {
        player.animations.play('walkUp', 5, true);
        player.y -= 5;
    } else if (cursors.down.isDown) {
        player.animations.play('walkDown', 5, true);
        player.y += 5;
    } else {
        player.animations.stop();
    }

    txtSeconds.setText(getTimeLapsed());
    game.physics.arcade.overlap(player, monster, monsterHitHandler);
}

function monsterHitHandler(playerObject, monsterObject) {
    if (0 != monsterObject.z)
        return;

    monsterObject.x = Math.random() * game.width;
    monsterObject.y = Math.random() * game.height;
    monsterObject.theName.destroy();
    monster.remove(monsterObject);
    score++;
    txtScore.setText(score.toString());

    ping = game.sound.play('ping');
    ping.volume = 0.7;

}
