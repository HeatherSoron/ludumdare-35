Class.makeClass(Mob, function Critter(x, y, width, height) {
	this.init();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.size = 1;

	this.wobbleRate = (Math.random() - 0.5) / 2;

	this.g = 230;
	this.b = 255;
	this.a = 0.8;

	this.z = 1;

	this.body = new SlimeBody(0, 0, this);
	this.bodyParts = [];
	this.calcBodyDetails();
});

Critter.prototype.left = function() { return this.x - this.size * (this.width/2); }
Critter.prototype.right = function() { return this.x + this.size * (this.width/2); }
Critter.prototype.top = function() { return this.y - this.size * (-this.body.y + this.height); }

Critter.prototype.sightRadius = function() {
	return this.width * 3;
}

Critter.prototype.growPair = function(partClass, x, y) {
	this.bodyParts.push(new partClass(x, y, this, false));
	this.bodyParts.push(new partClass(-x, y, this, true));
}

Critter.prototype.calcBodyDetails = function() {
	this.legCount = this.bodyParts.filter(function(el) { return el instanceof LegPart; }).length;
	this.maxSpeed = 3 + (this.legCount);
	this.isPlatform = this.body.type == 'platform';
}

Critter.prototype.shapeshift = function(critter) {
	this.width = critter.width;
	this.height = critter.height;
	this.body = critter.body.clone(this);
	this.body.type = critter.body.type;
	this.bodyParts = [];

	var self = this;
	critter.bodyParts.forEach(function(part) {
		var clone = part.clone(self);
		clone.type = part.type;
		self.bodyParts.push(clone);
	});
	this.calcBodyDetails();
}

Critter.prototype.eat = function(berry) {
	switch (berry.type) {
		case 'legs':
			this.body.y -= 5;
			this.growPair(LegPart, this.width * 0.2 + (this.body.y/3), this.body.y);
			break;
		case 'platform':
			this.height += 5;
			this.body.type = 'platform';
		default:
			// nothing
	}
	this.calcBodyDetails();
	
	this.size *= 1.1;
	if (this.size > 1.5) {
		var newSize = this.size / 2;
		this.size = newSize;
		var side = Math.random() <= 0.5 ? -1 : 1;
		var baby = new Critter(this.x + this.width * 1.3 * side, this.y, this.width, this.height);
		baby.size = newSize;
		baby.shapeshift(this);
		game.mobs.push(baby);
	}

	berry.kill();
}

Critter.prototype.accelerate = function(x, y) {
	var delta = 0.1 * (this.legCount + 2);
	var decay = delta * 2;
	var max = this.maxSpeed;

	var vDelta = 0.2;
	var vMax = 10;

	if (x * this.speed < 0) {
		// opposing directions. Let's add a bit of extra power
		x *= (delta + decay);
	} else if (x) {
		x *= delta;
	} else if (this.speed) {
		// if we're not deliberately moving, then slow down
		if (this.speed < 0) {
			this.speed += decay;
			if (this.speed > 0) {
				this.speed = 0;
			}
		} else if (this.speed > 0) {
			this.speed -= decay;
			if (this.speed < 0) {
				this.speed = 0;
			}
		}
	}

	this.speed += x;
	if (this.speed < -max) {
		this.speed = -max;
	} else if (this.speed > max) {
		this.speed = max;
	}


	if (!this.isGrounded()) {
		this.fallSpeed += vDelta * 2;
		if (this.fallSpeed > vMax) {
			this.fallSpeed = vMax;
		}
	} else {
		this.fallSpeed = y;
	}
};

Critter.prototype.isGrounded = function() {
	if (this.y >= canvas.height) {
		return true;
	}
	var platforms = game.mobs.filter(function(el) { return el.isPlatform; });
	for (var i = 0; i < platforms.length; ++i) {
		var p = platforms[i];
		if (Math.abs(this.x - p.x) < (this.width/2 * this.size + p.width/2 * p.size)) {
			if (this.y >= p.top()) {
				return true;
			}
		}
	}
	return false;
}

Critter.prototype.move = function() {
	this.x += this.speed;
	this.y += this.fallSpeed;

	if (this.y > canvas.height) {
		this.y = canvas.height;
	}
}

Critter.prototype.render = function() {
	this.bodyParts.forEach(function(el) {
		el.render();
	});
	this.body.render();
}

Critter.prototype.navToTarget = function() {
	if (this.target && this.target.dead) {
		this.target = null;
		this.minTargetDist = undefined;

	}

	if (this.target) {
		var distToTarget = this.target.distTo(this);
		if (this.minTargetDist === undefined || distToTarget < this.minTargetDist) {
			this.minTargetDist = distToTarget;
			this.lastApproachTick = game.tick;
		} else if (this.lastApproachTick < game.tick + 10) {
			if (Math.random() < 0.5) {
				this.target = null;
				this.minTargetDist = undefined;
			}
		}
	}

	if (!this.target) {
		var berries = game.mobs.filter(function(el) { return el instanceof Berry; });
		var nearest = null;
		var maxDist = this.sightRadius();
		var self = this;
		berries.forEach(function(berry) {
			var dist = berry.distTo(self);
			if (dist < maxDist) {
				if (!nearest || nearest.distTo(self) > dist) {
					nearest = berry;
				}
			}
		});
		this.target = nearest;
	} else if (this.isTouching(this.target)) {
		this.eat(this.target);
	} else {
		if (this.x > this.target.x) {
			return -1;
		} else if (this.x < this.target.x) {
			return 1;
		}
	}

	return 0;
}

Critter.prototype.update = function() {
	var xDelta = this.y == canvas.height ? this.navToTarget() : 0;
	var yDelta = 0;

	this.accelerate(xDelta, yDelta);

	this.move();

	this.calcAnimParams();
}

Critter.prototype.animSpeed = function() {
	return Math.min(3, Math.max(-3, this.speed));
}

Critter.prototype.calcAnimParams = function() {
	this.rawAmp = Math.sin((game.tick - this.birthTick) / (4.75 + this.wobbleRate)); 
	this.fastAmp = Math.sin(2 * (this.maxSpeed/3) * (game.tick - this.birthTick) / (4.75 + this.wobbleRate)); 
	this.wobble = this.size * (this.rawAmp * 2.5 - this.animSpeed()); 
	this.stretch = this.size * this.fallSpeed * 2;
}
