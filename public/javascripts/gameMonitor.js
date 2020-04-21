$(document).ready(function () {
    // Canvas init
    var canvas = document.getElementById("board");
    var ctx = canvas.getContext("2d");
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";

    // Images
    var spaceship1 = new Image(50, 50);
    spaceship1.src = '/assets/images/spaceship1.png';
    var spaceship2 = new Image(50, 50);
    spaceship2.src = '/assets/images/spaceship2.png';
    var spaceship3 = new Image(50, 50);
    spaceship3.src = '/assets/images/spaceship3.png';
    var spaceship4 = new Image(50, 50);
    spaceship4.src = '/assets/images/spaceship4.png';
    var bulletImage = new Image(10, 10);
    bulletImage.src = '/assets/images/bullet01.png';
    var zombie = new Image(50, 50);
    zombie.src = '/assets/images/zombie.png';

    // Game running
    gameRunning = false;

    // Spaceships to Players 
    var spaceshipIndex = 0;
    var spaceships = [spaceship1, spaceship2, spaceship3, spaceship4];
    var playerImage = {};

    // Game related information
    var zombiesPassed = 0;
    var Player = function (initPack) {
        var self = {};
        self.id = initPack.id;
        self.x = initPack.x;
        self.y = initPack.y;
        Player.list[self.id] = self;
        return self;
    };
    Player.list = {};

    var Bullet = function (initPack) {
        var self = {};
        self.id = initPack.id;
        self.x = initPack.x;
        self.y = initPack.y;
        Bullet.list[self.id] = self;
        return self;
    };
    Bullet.list = {};

    var Enemy = function (initPack) {
        var self = {};
        self.id = initPack.id;
        self.x = initPack.x;
        self.y = initPack.y;
        Enemy.list[self.id] = self;
        return self;
    };
    Enemy.list = {};

    var socket = io();

    // Init 
    socket.on('init', function (data) {
        for (var i in data.player) {
            new Player(data.player[i]);
        }
        for (var i in data.bullet) {
            new Bullet(data.bullet[i]);
        }
        for (var i in data.enemy) {
            new Enemy(data.enemy[i]);
        }
    });

    // Update 
    socket.on('update', function (data) {
        gameRunning = data.running;
        zombiesPassed = data.zombiesPassed;
        for (var i in data.player) {
            var pack = data.player[i];
            var p = Player.list[pack.id];

            // If player exsits- in case of connection problems this condition helps
            if (p) {
                if (pack.x !== undefined) {
                    p.x = pack.x;
                }
                if (pack.y !== undefined) {
                    p.y = pack.y;
                }
            }
        }

        for (var i in data.bullet) {
            var pack = data.bullet[i];
            var b = Bullet.list[pack.id];

            if (b) {
                if (pack.x !== undefined) {
                    b.x = pack.x;
                }
                if (pack.y !== undefined) {
                    b.y = pack.y;
                }
            }
        }

        for (var i in data.enemy) {
            var pack = data.enemy[i];
            var e = Enemy.list[pack.id];

            // If player exsits- in case of connection problems this condition helps
            if (e) {
                if (pack.x !== undefined) {
                    e.x = pack.x;
                }
                if (pack.y !== undefined) {
                    e.y = pack.y;
                }
            }
        }
    });

    // Remove 
    socket.on('remove', function (data) {
        // data.player -> array of id's
        // same for data.bullet and data.enemy
        for (var i in data.player) {
            delete Player.list[data.player[i]];
        }
        for (var i in data.bullet) {
            delete Bullet.list[data.bullet[i]];
        }
        for (var i in data.enemy) {
            delete Enemy.list[data.enemy[i]];
        }
    });

    setInterval(function () {
        ctx.clearRect(0, 0, 1000, 700);

        if (!gameRunning) {
            ctx.fillText("Connect to -> 'serverIP:2000/controller'", canvas.width / 2, 100);
        } else {
            ctx.fillText("Escaped:" + zombiesPassed, 100, 35);
        }

        // players loop
        for (i in Player.list) {
            var player = Player.list[i];

            // If the player doesn't have an asigned image
            if (!playerImage.hasOwnProperty(i.toString())) {
                playerImage[i] = spaceships[spaceshipIndex % spaceships.length];
                spaceshipIndex++;
            }
            ctx.drawImage(playerImage[i], player.x, player.y, 50, 50);
        }

        // bullet loop
        for (i in Bullet.list) {
            var bullet = Bullet.list[i];
            ctx.drawImage(bulletImage, bullet.x + 20, bullet.y, 10, 10);
        }

        // enemy loop
        for (i in Enemy.list) {
            var enemy = Enemy.list[i];
            ctx.drawImage(zombie, enemy.x, enemy.y, 50, 50);
        }
    }, 25);

    $('#restartButton').on('click', function () {
        ctx.clearRect(0, 0, 1000, 700);

        socket.emit('restart', {});
    });
    $('#startButton').on('click', function () {
        socket.emit('start', {});
    });
    $('#stopButton').on('click', function () {
        Enemy.list = {};
        socket.emit('stop', {});
    });
});