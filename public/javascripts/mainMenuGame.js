var MainMenuGame = {};

MainMenuGame.preload = function() {
    this.load.image('fullscreenButton', '/assets/images/fullscreen.png');
    this.load.image('startButton', '/assets/images/startButton.png');
};

var fullscreenButton;
var startButton;
MainMenuGame.create = function() {
    fullscreenButton = this.add.button(0, 0, 'fullscreenButton', gofull, this, 2, 1, 0);
    fullscreenButton.scale.setTo(0.15);
    
    startButton = this.add.button(50, 50, 'startButton', startGame, this, 2, 1, 0);
};

MainMenuGame.update = function () {
    
};

function gofull() {

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }

}
    
function startGame() {
    game.state.start('BattleShipGame');
}