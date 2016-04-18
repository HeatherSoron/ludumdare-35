// these two variables will be used all over the place, and are defined in the init() function (in init.js)
var canvas;
var ctx;

// can be used to store game-specific data
var game = {
	mode: 'title',
};

function setupGameWorld() {
	// put game-specific initialization in here

	var width = 40;
	var height = 25;
	var left = 100;
	var y = 300;
	
	game.tick = 0;
	game.mobs = [];

	if (game.mode == 'play') {
		game.player = new Player(left, y, width, height);
		game.mobs.push(game.player);

		for (var i = 0; i < 4; ++i) {
			game.mobs.push(new Critter(left * (i + 0.5), y, width, height));
		}

		recalcCritterCount();

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

		function platformBush() {
			var top = this.top();
			var right = this.right();
			var left = this.left();
			var bottom = this.bottom();

			ctx.moveTo(left, bottom);
			ctx.quadraticCurveTo(this.x, this.y, left, top);
			ctx.lineTo(right, top);
			ctx.quadraticCurveTo(this.x, this.y, right, bottom);
			ctx.lineTo(left, bottom);
		}

		function superBush() {
			ctx.arc(this.x, this.y, this.size + 0.5 * Math.sin(game.tick / 7), 0, Math.PI * 2);
		}

		var normalCount = 0;
		var legCount = 0;
		var platformCount = 0;
		for (var i = -canvas.width; i < canvas.width * 2; ++i) {
			if (Math.random() < 0.01) {
				game.mobs.push(new Bush(i, canvas.height - 10, 20));
				// don't put bushes too close together
				i += 30;
				normalCount++;
			}
		}
		for (var i = -canvas.width; i < canvas.width * 2; ++i) {
			if (Math.random() < 0.003) {
				if (Math.random() < 0.5) {
					game.mobs.push(new Bush(i, canvas.height - 70, 15, diamondBush, 'legs'));
					legCount++;
				} else {
					game.mobs.push(new Bush(i, canvas.height - 70, 15, platformBush, 'platform'));
					platformCount++;
				}
				i += 30;
			}
		}
		for (var i = -1; i <= 1; ++i) {
			game.mobs.push(new Bush(i * canvas.width + game.player.x, canvas.height - 150, 20, superBush, 'super'));
		}

		//game.player.eat(new Berry(1, 2, 3, null, 'wings'));

		if (normalCount < 5 || legCount < 3 || platformCount < 2) {
			setupGameWorld();
		}
	} else if (game.mode == 'title') {
		game.mobs.push(new Critter(canvas.width/2, y, width, height));
		game.mobs.push(new Critter(100, y, width, height));
		game.mobs.push(new Critter(500, y, width, height));
		game.mobs[0].eat(new Berry('meh', 'ignore', 'this', null, 'legs'));
		game.mobs[1].eat(new Berry('meh', 'ignore', 'this', null, 'legs'));
		game.mobs[1].eat(new Berry('meh', 'ignore', 'this', null, 'legs'));
		game.mobs[2].eat(new Berry('meh', 'ignore', 'this', null, 'legs'));
		game.mobs[2].eat(new Berry('meh', 'ignore', 'this', null, 'legs'));
		game.mobs[2].eat(new Berry('meh', 'ignore', 'this', null, 'platform'));
		game.mobs.push(new Critter(200, y, width, height));
		game.mobs.push(new Critter(400, y, width, height));
	}
}

function recalcCritterCount() {
	game.critterCount = game.mobs.filter(function(el) { return (el instanceof Critter) && !(el.dead); }).length;
}

// this is the main function which runs all of our game logic. The initialization code sets this up to be run periodically
function runGame() {
	game.tick += 1;
	updateGame();
	renderGame();
}

function updateGame() {
	if (game.mode == 'title') {
		if (keysHeld.enter || keysHeld.space) {
			game.mode = 'play';
			setupGameWorld();
		} else if (keysHeld.slash || keysHeld.h) {
			game.mode = 'help';
			setupGameWorld();
		}
	} else if (game.mode == 'help') {
		if (keysHeld.enter || keysHeld.space) {
			game.mode = 'title';
			setupGameWorld();
			keysHeld.enter = false;
			keysHeld.space = false;
		}
	}
	game.mobs.forEach(function(mob) {
		mob.update();
	});
	game.mobs = game.mobs.filter(function(el) { return !el.dead; });
}

function renderGame() {
	// clear the screen before drawing the next frame. Otherwise, each frame would be drawn on top of the last one, which is good for a painting program, but not good for a game
	clearScreen();

	ctx.save();

	if (game.mode == 'play') {
		ctx.translate(-game.player.x + canvas.width/2, 0);
	}
	
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
	
	if (game.mode == 'play') {
		ctx.textAlign = 'left';
		ctx.font = '18px Arial';
		ctx.fillText('Critters: ' + game.critterCount, 10, 25);
	} else if (game.mode == 'title') {
		ctx.textAlign = 'center';
		var middle = canvas.width/2;

		ctx.font = '30px Arial';
		ctx.fillText('Polymorphic Menagerie', middle, 50);
		ctx.font = '20px Arial';
		ctx.fillText('What will you grow?', middle, 80);

		ctx.font = '14px Arial';
		ctx.fillText('Press ENTER to start', middle, canvas.height/2);
		ctx.fillText("Press '?' or 'H' for instructions", middle, canvas.height/2 + 30);
	} else if (game.mode = 'help') {
		var middle = canvas.width/2;

		ctx.textAlign = 'center';
		ctx.font = '16px Arial';
		ctx.fillText('What a wonderful menagerie of critters! You can give them legs with the', middle, 30);
		ctx.fillText('diamond berries, or turn them into platforms with the hourglass berries.', middle, 50);

		ctx.fillText('Super berries, which are green instead of red, can grow new bushes.', middle, 80);
		ctx.fillText("Combine a super berry that you're holding with a berry you're touching,", middle, 100);
		ctx.fillText("and you can then plant it to make that type of berry bush.", middle, 120);

		ctx.fillText("What kind of critters will you make? See what fun combinations exist!", middle, 150);
		ctx.fillText("Just keep them well fed - when they get too hungry, well...", middle, 170);

		var ctrl = [
			['Move player', 'LEFT / RIGHT arrow'],
			['Jump', 'SPACE BAR'],
			['Transform into critter', 'T'],
			['Grab / Use berry', 'G'],
			['Drop berry', 'D'],
			['Return to title screen', 'ENTER'],
		];
		
		ctx.font = '14px Arial';
		ctrl.forEach(function(line, i) {
			ctx.strokeStyle = 'black';
			ctx.textAlign = 'right';
			ctx.fillText(line[0], middle - 20, i * 30 + 230);
			ctx.textAlign = 'left';
			ctx.fillText(line[1], middle + 20, i * 30 + 230);
			ctx.beginPath();

			ctx.strokeStyle = 'rgb(100,100,100)';
			ctx.moveTo(middle - 70, i * 30 + 240);
			ctx.lineTo(middle + 70, i * 30 + 240);
			ctx.stroke();
		});
		ctx.strokeStyle = 'black';
	}
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
