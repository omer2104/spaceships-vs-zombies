$(document).ready(function () {
    var socket = io();
    
    // Sound effects
    var laserShot = new Audio('/assets/sounds/lasershot.wav');
    
    // Joystick related
    /*var static = nipplejs.create({
        zone: document.getElementById('static'),
        size: 150,
        mode: 'static',
        position: {
            left: '75%',
            top: '50%'
        },
        color: 'white'
    });*/
    
    var static = nipplejs.create({
        zone: document.getElementById('static'),
        color: 'white'
    });
    
    // move event
    static.on('move', function (evt, data) {
        console.log(data);
        socket.emit('joystickMove', data);
    });
    
    static.on('end', function (evt, data) {
        console.log("off"); 
        socket.emit('joystickOff', {});
    });
    
    // shoot event
    var shootImage = document.getElementById('shoot');
    shootImage.addEventListener('touchstart', function (event) {
        shootImage.src = "/assets/images/shoot2.png";
    });
    shootImage.addEventListener('touchend', function (event) {
        shootImage.src = "/assets/images/shoot.png";
        socket.emit('shootBullet', {});
        laserShot.currentTime=0;
        laserShot.play();
    });
});