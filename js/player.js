Class.makeClass(Critter, function Player(x, y, width, height) {
	this.init();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.size = 1;
	this.stiffness = 0;

	this.r = 220;
	this.b = 220;
	
	this.z = 2;
});

Player.prototype.findTouching = function() {
	var self = this;
	var bb = this.getBounds();
	return game.mobs.filter(function(el) {
		return el.getBounds().intersects(bb);
	});
}

Player.prototype.update = function() {
	var x = 0;
	var y = 0;

	if (keysHeld.g) {
		var touching = this.findTouching();
		if (touching.length) {
			var self = this;
			var grabbed = touching.filter(function(el) { return el.grabbedBy == self; }); 

			if (grabbed.length) {
				var critters = touching.filter(function(el) { return el instanceof Critter; });
				if (critters.length) {
					critters[0].eat(grabbed[0]);
				}
			} else {
				var berries = touching.filter(function(el) { return el instanceof Berry; });
				if (berries.length) {
					berries[0].grabbedBy = this;
				}
			}
		}
		// treat this as a press-then-release key (probably breaking abstraction, but, eh. game jam)
		keysHeld.g = false;
	}
	if (keysHeld.t) {
		var critters = this.findTouching().filter(function(el) { return el instanceof Critter; });
		if (critters.length) {
			this.shapeshift(critters[0]);
		}
		// treat this as a press-then-release key (probably breaking abstraction, but, eh. game jam)
		keysHeld.t = false;
	}
	if (keysHeld.space && this.y >= canvas.height) {
		console.log('jumping');
		y = -(4 * (this.stiffness + 2));
		keysHeld.space = false;
	}

	if (keysHeld.left) {
		x -= 1;
	}
	if (keysHeld.right) {
		x += 1;
	}

	this.accelerate(x, y);

	this.move();
}
