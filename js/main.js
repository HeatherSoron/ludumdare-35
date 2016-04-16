// these two variables will be used all over the place, and are defined in the init() function (in init.js)
var canvas;
var ctx;

// can be used to store game-specific data
var game = {};

function setupGameWorld() {
	// put game-specific initialization in here
	
	game.tick = 0;
	game.speed = 0;
	game.offset = 0;
	game.player = new Player(100, 100, 40, 25);
}

// this is the main function which runs all of our game logic. The initialization code sets this up to be run periodically
function runGame() {
	game.tick += 1;
	updateGame();
	renderGame();
}

function updateGame() {
	var x = 0;
	var y = 0;
	if (keysHeld.left) {
		x -= 1;
	}
	if (keysHeld.right) {
		x += 1;
	}

	game.player.accelerate(x, y);

	game.player.move();
}

function renderGame() {
	// clear the screen before drawing the next frame. Otherwise, each frame would be drawn on top of the last one, which is good for a painting program, but not good for a game
	clearScreen();
	
	game.player.render();
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
