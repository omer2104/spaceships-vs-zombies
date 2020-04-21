var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);

app.use('/assets', express.static(path.join(__dirname, '/public')));

server.listen(2000);

var io = require('socket.io')(server, {});

var isController = true;
var CONTROLLERS = {};
var MONITORS = {};
var IdGenerator = 0;

// Monitor consts
var mWidth = 1000;
var mHeight = 700;
var distEdge = 60;

// Game globals
var gameRunning = false;
var bulletRange = 50;
var fireRate = 200;
var zombiesPassed = 0;

// Entity- abstract class
// Entity Ctor
var Entity = function () {
    var self = {
        x: 250,
        y: 400,
        id: "",
        progressionX: 0,
        progressionY: 0,
        speed: 5
    };

    self.update = function () {
        self.updatePosition();
    };

    self.updatePosition = function () {
        self.x += self.progressionX;
        self.y += self.progressionY;
    };

    self.getDistance = function (pt) {
        return Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
    };
    return self;
};

// Player- extends Entity
// Player Ctor
var Player = function (id) {
    var self = Entity();
    self.id = id;

    // Shooting handling
    self.shootingBullet = false;
    self.canShoot = true;
    self.timer = 0;

    var superUpdate = self.update;
    self.update = function () {
        self.updatePosition();
        //superUpdate();

        if (self.shootingBullet) {
            if (self.canShoot) {
                self.shootBullet();
                self.canShoot = false;
                setTimeout(function () {
                    self.canShoot = true;
                }, fireRate);
            }
            self.shootingBullet = false;
        }
    };

    self.shootBullet = function () {
        var b = Bullet();
        b.x = self.x;
        b.y = self.y;
    };

    self.updatePosition = function () {
        if (self.progressionX < 0 && self.x + self.progressionX - distEdge / 10 <= 0) {
            self.progressionX = 0;
        }
        if (self.progressionX > 0 && self.x + self.progressionX + distEdge >= mWidth) {
            self.progressionX = 0;
        }
        if (self.progressionY > 0 && self.y + self.progressionY + distEdge >= mHeight) {
            self.progressionY = 0;
        }
        if (self.progressionY < 0 && self.y + self.progressionY - distEdge / 10 <= 0) {
            self.progressionY = 0;
        }
        self.x += self.speed * self.progressionX;
        self.y += self.speed * self.progressionY;
    };

    Player.list[id] = self;

    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y
        };
    };

    self.getUpdatePack = function () {
        return {
            x: self.x,
            y: self.y,
            id: self.id
        };
    };

    self.getRemovePack = function () {
        return self.id;
    };

    initPack.player.push(self.getInitPack());
    return self;
};
Player.list = {};
Player.onConnect = function (socket) {
    // init and save player
    var player = Player(socket.id);

    socket.on('joystickMove', function (data) {
        player.progressionX = 0;
        player.progressionY = 0;

        if (data != undefined) {
            player.progressionX = Math.cos(data.angle.radian) * data.force;
            player.progressionY = -Math.sin(data.angle.radian) * data.force;
        }
    });

    socket.on('shootBullet', function (data) {
        player.shootingBullet = true;
    });

    socket.on('joystickOff', function (data) {
        player.progressionX = 0;
        player.progressionY = 0;
    });
};
Player.onDisconnect = function (socket) {
    delete Player.list[socket.id];
    removePack.player.push(socket.id);
};
Player.update = function () {
    var pack = [];
    for (var i in Player.list) {
        var player = Player.list[i];
        player.update();
        pack.push(player.getUpdatePack());
    }

    return pack;
};
Player.getAllInitPack = function () {
    var players = [];
    for (var i in Player.list) {
        players.push(Player.list[i].getInitPack());
    }
    return players;
};
Player.getAllRemovePack = function () {
    var players = [];
    for (var i in Player.list) {
        players.push(Player.list[i].getRemovePack());
    }
    return players;
};


// Bullet- extends Entity
// Bullet Ctor
var Bullet = function () {
    var self = Entity();
    self.id = IdGenerator++;
    self.progressionX = 0;
    self.progressionY = -10;

    self.timer = 0;
    self.toRemove = false;
    var superUpdate = self.update;

    self.update = function () {
        if (self.timer++ > bulletRange) {
            self.toRemove = true;
        }
        superUpdate();

        for (var i in Enemy.list) {
            var e = Enemy.list[i];

            if (self.getDistance(e) < 32) {
                //TODO: handle collision of bullet with enemy i.e lower hp for enemy
                e.hitByBullet();
                self.toRemove = true;
            }
        }
    };
    Bullet.list[self.id] = self;

    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y
        };
    };

    self.getUpdatePack = function () {
        return {
            x: self.x,
            y: self.y,
            id: self.id
        };
    };

    self.getRemovePack = function () {
        return self.id;
    };

    initPack.bullet.push(self.getInitPack());
    return self;
};
Bullet.list = {};
Bullet.update = function () {
    var pack = [];

    for (i in Bullet.list) {
        var bullet = Bullet.list[i];
        bullet.update();
        if (bullet.toRemove) {
            delete Bullet.list[i];
            removePack.bullet.push(bullet.id);
        } else {
            pack.push(bullet.getUpdatePack());
        }
    }
    return pack;
};
Bullet.getAllInitPack = function () {
    var bullets = [];
    for (var i in Bullet.list) {
        bullets.push(Bullet.list[i].getInitPack());
    }
    return bullets;
};
Bullet.getAllRemovePack = function () {
    var bullets = [];
    for (var i in Bullet.list) {
        bullets.push(Bullet.list[i].getRemovePack());
    }
    return bullets;
};

// Enemy- extends Entity
// Enemy Ctor
var Enemy = function (id) {
    var self = Entity();
    self.id = id;
    self.toRemove = false;

    // Override data members
    self.y = 0;
    self.x = Math.round(Math.random() * (mWidth - 50));
    self.speed = 1;
    self.progressionX = 0;
    self.progressionY = Math.round(Math.random() * 10) / 4 + 1;

    // HP
    self.hp = 2;

    var superUpdate = self.update;
    self.update = function () {
        self.updatePosition();
        //superUpdate();
        // Passed the spaceships
        if (self.y > mHeight + 10) {
            self.toRemove = true;
            zombiesPassed++;
        }

        if (self.hp <= 0) {
            self.toRemove = true;
        }
    };

    self.updatePosition = function () {
        self.y += self.speed * self.progressionY;
    };

    self.hitByBullet = function () {
        self.hp--;
    };

    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y
        };
    };

    self.getUpdatePack = function () {
        return {
            x: self.x,
            y: self.y,
            id: self.id
        };
    }

    self.getRemovePack = function () {
        return self.id;
    };

    Enemy.list[id] = self;
    initPack.enemy.push(self.getInitPack());
    return self;
};
Enemy.list = {};
Enemy.update = function () {
    var pack = [];
    for (var i in Enemy.list) {
        var enemy = Enemy.list[i];
        enemy.update();
        if (enemy.toRemove) {
            delete Enemy.list[i];
            removePack.enemy.push(enemy.id);
        } else {
            pack.push(enemy.getUpdatePack());
        }
    }

    return pack;
};
Enemy.getAllInitPack = function () {
    var enemies = [];
    for (var i in Enemy.list) {
        enemies.push(Enemy.list[i].getInitPack());
    }
    return enemies;
};
Enemy.getAllRemovePack = function () {
    var enemies = [];
    for (var i in Enemy.list) {
        enemies.push(Enemy.list[i].getRemovePack());
    }
    return enemies;
};

app.get('/', function (req, res, next) {
    res.sendFile(path.join(path.join(__dirname, 'public'), 'phaser.html'));
});

app.get('/controller', function (req, res) {
    isController = true;
    res.sendFile(path.join(path.join(__dirname, 'public'), 'gameJoystick.html'));
});
 
app.get('/monitor', function (req, res) {
    isController = false;
    res.sendFile(path.join(path.join(__dirname, 'public'), 'gameMonitor.html'));
});

io.sockets.on('connection', function (socket) {
    socket.id = IdGenerator++;

    // If the user asked for controller
    if (isController) {
        CONTROLLERS[socket.id] = socket;
        console.log("joystick connected: " + socket.id);

        Player.onConnect(socket);
        socket.on('disconnect', function () {
            delete CONTROLLERS[socket.id];
            Player.onDisconnect(socket);

            console.log("joystick out: " + socket.id);
        });
    } else { // If the user asked for monitor
        MONITORS[socket.id] = socket;
        console.log("monitor connected: " + socket.id);

        // Send to monitor the game state
        socket.emit('init', {
            player: Player.getAllInitPack(),
            bullet: Bullet.getAllInitPack(),
            enemy: Enemy.getAllInitPack()
        });

        socket.on("disconnect", function () {
            delete MONITORS[socket.id];
            console.log("monitor out: " + socket.id);
        });

        socket.on('start', function () {
            zombiesPassed = 0;
            gameRunning = true;
        });

        socket.on('stop', function () {
            gameRunning = false;

            socket.emit('remove', {
                player: [],
                bullet: [],
                enemy: Enemy.getAllRemovePack()
            });
            Enemy.list = {};
        });

        socket.on("restart", function () {
            zombiesPassed = 0;
            gameRunning = false;

            socket.emit('remove', {
                player: Player.getAllRemovePack(),
                bullet: Bullet.getAllRemovePack(),
                enemy: Enemy.getAllRemovePack()
            });
            CONTROLLERS = {};
            Player.list = {};
            Enemy.list = {};
            Bullet.list = {};
        });
    }
});

var initPack = {
    player: [],
    bullet: [],
    enemy: []
};
var removePack = {
    player: [],
    bullet: [],
    enemy: []
};

setInterval(function () {
    var rand = Math.random();
    if (gameRunning && rand > 0.2 && rand < 0.21) {
        var enemy = Enemy(IdGenerator++);
    }
    var pack = {
        player: Player.update(),
        bullet: Bullet.update(),
        enemy: Enemy.update(),
        running: gameRunning,
        zombiesPassed: zombiesPassed
    };

    for (var i in MONITORS) {
        var socket = MONITORS[i];
        socket.emit('init', initPack);
        socket.emit('update', pack);
        socket.emit('remove', removePack);
    }
    initPack.player = [];
    initPack.bullet = [];
    initPack.enemy = [];
    removePack.player = [];
    removePack.bullet = [];
    removePack.enemy = [];
}, 1000 / 40);