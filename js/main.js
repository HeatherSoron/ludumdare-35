// these two variables will be used all over the place, and are defined in the init() function (in init.js)
var canvas;
var ctx;

// can be used to store game-specific data
var game = {};

function setupGameWorld() {
	// put game-specific initialization in here

	var width = 40;
	var height = 25;
	var left = 100;
	var y = 100;
	
	game.tick = 0;

	game.player = new Player(left, y, width, height);
	game.mobs = [];
	game.mobs.push(game.player);

	for (var i = 0; i < 4; ++i) {
		game.mobs.push(new Critter(left * (i + 0.5), y, width, height));
	}

	game.mobs.push(new Berry(200, canvas.height - 10, 5));

}

// this is the main function which runs all of our game logic. The initialization code sets this up to be run periodically
function runGame() {
	game.tick += 1;
	updateGame();
	renderGame();
}

function updateGame() {
	game.mobs.forEach(function(mob) {
		mob.update();
	});
	game.mobs = game.mobs.filter(function(el) { return !el.dead; });
}

function renderGame() {
	// clear the screen before drawing the next frame. Otherwise, each frame would be drawn on top of the last one, which is good for a painting program, but not good for a game
	clearScreen();
	
	game.mobs.forEach(function(mob) {
		mob.render();
	});
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
