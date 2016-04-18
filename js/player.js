Class.makeClass(Critter, function Player(x, y, width, height) {
	this.init();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.size = 1;

	this.wobbleRate = 1;

	this.r = 220;
	this.b = 220;
	
	this.z = 2;

	this.body = new SlimeBody(0, 0, this);
	this.bodyParts = [];
	this.calcBodyDetails();
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
				if (grabbed[0] instanceof SuperBerry) {
					var berries = touching.filter(function(el) { return el instanceof Berry; });
					if (berries.length) {
						var berry = berries[0];
						grabbed[0].type = berry.type;
						grabbed[0].definePath = berry.definePath;
						grabbed[0].bushSize = berry.size * 4;
						berry.kill();
					} else {
						grabbed[0].plant();
					}
				} else {
					var critters = touching.filter(function(el) { return el instanceof Critter; });
					if (critters.length) {
						critters[0].eat(grabbed[0]);
					}
				}
			} else {
				var supers = touching.filter(function(el) { return el instanceof SuperBerry; });
				if (supers.length) {
					supers[0].grabbedBy = this;
				} else {
					var berries = touching.filter(function(el) { return el instanceof Berry; });
					if (berries.length) {
						berries[0].grabbedBy = this;
					}
				}
			}
		}
		// treat this as a press-then-release key (probably breaking abstraction, but, eh. game jam)
		keysHeld.g = false;
	}
	if (keysHeld.d) {
		var self = this;
		var grabbed = game.mobs.filter(function(el) { return el.grabbedBy == self; }); 
		if (grabbed.length) {
			grabbed[0].grabbedBy = null;
		}
		keysHeld.d = false;
	}
	if (keysHeld.t) {
		var critters = this.findTouching().filter(function(el) { return el instanceof Critter; });
		if (critters.length) {
			this.shapeshift(critters[0]);
		}
		// treat this as a press-then-release key (probably breaking abstraction, but, eh. game jam)
		keysHeld.t = false;
	}
	if (keysHeld.space && this.isGrounded()) {
		console.log('jumping');
		y = -8;
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

	this.calcAnimParams();
}
