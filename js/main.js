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

	function diamondBush() {
		var top = this.top();
		var right = this.right();
		var left = this.left();
		var bottom = this.bottom();

		ctx.moveTo(this.x, top);
		ctx.lineTo(right, this.y);
		ctx.lineTo(this.x, bottom);
		ctx.lineTo(left, this.y);
		ctx.lineTo(this.x, top);
	}
	for (var i = -canvas.width; i < canvas.width * 2; ++i) {
		if (Math.random() < 0.01) {
			game.mobs.push(new Bush(i, canvas.height - 10, 20));
			// don't put bushes too close together
			i += 30;
		}
	}
	for (var i = -canvas.width; i < canvas.width * 2; ++i) {
		if (Math.random() < 0.003) {
			game.mobs.push(new Bush(i, canvas.height - 70, 15, diamondBush, 'legs'));
			i += 30;
		}
	}

	game.player.eat(new Berry(1, 2, 3, null, 'legs'));
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

	ctx.save();

	ctx.translate(-game.player.x + canvas.width/2, 0);
	
	var layers = [];
	game.mobs.forEach(function(mob) {
		if (!layers[mob.z]) {
			layers[mob.z] = [];
		}
		layers[mob.z].push(mob);
	});
	layers.forEach(function(layer) {
		layer.forEach(function(mob) {
			mob.render();
		});
	});

	ctx.restore();
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
