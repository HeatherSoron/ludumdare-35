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
}

// this is the main function which runs all of our game logic. The initialization code sets this up to be run periodically
function runGame() {
	game.tick += 1;
	updateGame();
	renderGame();
}

function updateGame() {
	var delta = 0.2;
	var decay = delta * 2;
	var max = 3;
	if (keysHeld.left) {
		game.speed -= delta;
		if (game.speed < -max) {
			game.speed = -max;
		}
	} else if (game.speed < 0) {
		game.speed += decay;
		if (game.speed > 0) {
			game.speed = 0;
		}
	}
	if (keysHeld.right) {
		game.speed += delta;
		if (game.speed > max) {
			game.speed = max;
		}
	} else if (game.speed > 0) {
		game.speed -= decay;
		if (game.speed < 0) {
			game.speed = 0;
		}
	}

	game.offset += game.speed;
}

function renderGame() {
	// clear the screen before drawing the next frame. Otherwise, each frame would be drawn on top of the last one, which is good for a painting program, but not good for a game
	clearScreen();
	
	var top = 100;
	var height = 25;
	var bottom = top + height;
	var hMid = 100 + game.offset;
	var width = 40;

	var wobble = Math.sin(game.tick / 5) * 2.5 - game.speed; 

	ctx.beginPath();
	
	ctx.moveTo(hMid, bottom);
	ctx.lineTo(hMid - width/2, bottom);
	ctx.bezierCurveTo(hMid + wobble - width/2, top, hMid + wobble + width/2, top, hMid + width/2, bottom);
	ctx.lineTo(hMid, bottom);

	ctx.rect(hMid - game.offset - width/2, top - height*2, width, height);

	ctx.stroke();
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
