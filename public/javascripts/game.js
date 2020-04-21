var game;
$(document).ready(function () {
    /*var game = new Phaser.Game(640, 360, Phaser.AUTO);
    
    var GameState = {
        preload: function() {
            this.load.image('background', 'assets/images/images.jpg');
        },
        create: function() {
            this.background = this.game.add.sprite(100, 100, 'background');
            this.background.anchor.setTo(0.5, 0.5);
        },
        update: function() {
            this.background.angle += 0.5;
        }
    };
    
    game.state.add('GameState', GameState);
    
    game.state.start('GameState');*/

    /*var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

    function preload() {

        game.load.image('sky', '/assets/images/sky.png');
        game.load.image('ground', '/assets/images/platform.png');
        game.load.image('star', '/assets/images/star.png');
        game.load.spritesheet('dude', '/assets/images/dude.png', 32, 48);
        game.load.image('bullet', '/assets/images/bullet01.png');
    }

    var player;
    var weapon;
    var fireButton;
    var platforms;
    var cursors;

    var stars;
    var score = 0;
    var scoreText;

    var playerSpeed = 300;

    function create() {

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        // player.body.bounce.y = 0.2;
        // player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);


        // Creates 30 bullets, using the 'bullet' graphic
        weapon = game.add.weapon(30, 'bullet');
        
        //  The bullet will be automatically killed when it leaves the world bounds
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        //  The speed at which the bullet is fired
        weapon.bulletSpeed = 600;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        weapon.fireRate = 100;

        //  Tell the Weapon to track the 'player' Sprite
        //  With no offsets from the position
        //  But the 'true' argument tells the weapon to track sprite rotation
        weapon.trackSprite(player, 14, 0, true);

        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        //  Finally some stars to collect
        stars = game.add.group();

        //  We will enable physics for any star that is created in this group
        stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        //  The score
        scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();

    }

    function update() {

        //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        game.physics.arcade.overlap(player, stars, collectStar, null, this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        var nothingPressed = true;

        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -playerSpeed;

            player.animations.play('left');
            nothingPressed = false;
        }
        if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = playerSpeed;

            player.animations.play('right');
            nothingPressed = false;
        }
        if (cursors.up.isDown) {
            player.body.velocity.y = -playerSpeed;
            nothingPressed = false;
        }
        if (cursors.down.isDown) {
            player.body.velocity.y = playerSpeed;
            nothingPressed = false;
        }

        if (fireButton.isDown) {
            weapon.fire();
        }

        if (nothingPressed) {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

    }

    function collectStar(player, star) {

        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        score += 10;
        scoreText.text = 'Score: ' + score;

    }

    function render() {

        weapon.debug();

    }*/

    game = new Phaser.Game($(window).width(), $(window).height(), Phaser.CANVAS, 'phaser-example');



    var BattleShipGame = {};

    BattleShipGame.preload = function () {

        this.load.image('fullscreenButton', '/assets/images/fullscreen.png');
        game.load.image('ship', '/assets/images/spaceship1.png');
        game.load.image('bullet', '/assets/images/bullet01.png');
        game.load.image('space', '/assets/images/space.png');
    };

    var background;
    var sprite;
    var speed = 250;
    var weapon;
    var cursors;
    var fireButton;

    BattleShipGame.create = function () {
        background = game.add.sprite(0, 0, 'space');
        background.scale.setTo(2);

        fullscreenButton = this.add.button(0, 0, 'fullscreenButton', gofull, this, 2, 1, 0);
        fullscreenButton.scale.setTo(0.15);
        //  Creates 30 bullets, using the 'bullet' graphic
        weapon = game.add.weapon(30, 'bullet');

        //  The bullet will be automatically killed when it leaves the world bounds
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        //  Because our bullet is drawn facing up, we need to offset its rotation:
        weapon.bulletAngleOffset = 90;

        //  The speed at which the bullet is fired
        weapon.bulletSpeed = 400;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        weapon.fireRate = 60;

        sprite = this.add.sprite(320, 500, 'ship');
        sprite.anchor.setTo(0.5);
        sprite.scale.setTo(0.07);
        game.physics.arcade.enable(sprite);

        sprite.body.collideWorldBounds = true;

        //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
        weapon.trackSprite(sprite, 0, -14);

        cursors = this.input.keyboard.createCursorKeys();

        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    };

    var fireButtonUp = true;

    BattleShipGame.update = function () {
        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;

        if (cursors.left.isDown) {
            sprite.body.velocity.x = -speed;
        }
        if (cursors.right.isDown) {
            sprite.body.velocity.x = speed;
        }
        if (cursors.up.isDown) {
            sprite.body.velocity.y = -speed;
        }
        if (cursors.down.isDown) {
            sprite.body.velocity.y = speed;
        }

        if (fireButton.isDown && fireButtonUp) {
            weapon.fire();
            fireButtonUp = false;
        }
        if (fireButton.isUp) {
            fireButtonUp = true;
        }

        // mobile section
        if (game.input.pointer1.isDown) {
            weapon.fire();
        }
    };

    BattleShipGame.render = function () {
        weapon.debug();
    };

    game.state.add('MainMenu', MainMenuGame);
    game.state.add('BattleShipGame', BattleShipGame);

    game.state.start('MainMenu');
    
    var socket = io();
    
    socket.on('clients', function (data) {
        console.log(data); 
    });
});