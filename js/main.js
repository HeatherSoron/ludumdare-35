// these two variables will be used all over the place, and are defined in the init() function (in init.js)
var canvas;
var ctx;

// can be used to store game-specific data
var game = {};

function setupGameWorld() {
	// put game-specific initialization in here
	
	game.tick = 0;
}

// this is the main function which runs all of our game logic. The initialization code sets this up to be run periodically
function runGame() {
	game.tick += 1;
	updateGame();
	renderGame();
}

function updateGame() {
	// put code in here which handles the game logic (moving the player, etc.)
	
	// example code below (commented out)
/*
	var playerSpeed = 1;
	if (keysHeld.left) {
		game.playerCenter.x -= playerSpeed;
	}
	if (keysHeld.right) {
		game.playerCenter.x += playerSpeed;
	}
*/
}

function renderGame() {
	// clear the screen before drawing the next frame. Otherwise, each frame would be drawn on top of the last one, which is good for a painting program, but not good for a game
	clearScreen();
	
	var top = 100;
	var height = 25;
	var bottom = top + height;
	var hMid = 100;
	var width = 40;

	var wobble = Math.sin(game.tick / 5) * 2.5; 

	ctx.beginPath();
	
	ctx.moveTo(hMid, bottom);
	ctx.lineTo(hMid - width/2, bottom);
	ctx.bezierCurveTo(hMid + wobble - width/2, top, hMid + wobble + width/2, top, hMid + width/2, bottom);
	ctx.lineTo(hMid, bottom);

	ctx.rect(hMid - width/2, top - height*2, width, height);

	ctx.stroke();
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
