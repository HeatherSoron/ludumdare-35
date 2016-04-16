Class.makeClass(Critter, function Player(x, y, width, height) {
	this.init();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.r = 220;
	this.b = 220;
});

Player.prototype.findTouching = function() {
	var self = this;
	var bb = this.getBounds();
	return game.mobs.filter(function(el) {
		return el.getBounds().intersects(bb);
	});
}

Player.prototype.update = function() {
	if (keysHeld.space) {
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
		// treat space as a press-then-release key (probably breaking abstraction, but, eh. game jam)
		keysHeld.space = false;
	}

	var x = 0;
	var y = 0;
	if (keysHeld.left) {
		x -= 1;
	}
	if (keysHeld.right) {
		x += 1;
	}

	this.accelerate(x, y);

	this.move();
}
