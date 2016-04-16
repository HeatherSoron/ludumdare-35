Class.makeClass(Mob, function Critter(x, y, width, height) {
	this.init();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.size = 1;

	this.g = 230;
	this.b = 255;
	this.a = 0.8;

	this.z = 1;
});

Critter.prototype.left = function() { return this.x - this.size * (this.width/2); }
Critter.prototype.right = function() { return this.x + this.size * (this.width/2); }
Critter.prototype.top = function() { return this.y - this.size * (this.height); }

Critter.prototype.sightRadius = function() {
	return this.width * 3;
}

Critter.prototype.eat = function(berry) {
	this.size *= 1.1;
	if (this.size > 1.5) {
		var newSize = this.size / 2;
		this.size = newSize;
		var side = Math.random() <= 0.5 ? -1 : 1;
		var baby = new Critter(this.x + this.width * 1.3 * side, this.y, this.width, this.height);
		baby.size = newSize;
		game.mobs.push(baby);
	}

	berry.kill();
}

Critter.prototype.accelerate = function(x, y) {
	var delta = 0.2;
	var decay = delta * 2;
	var max = 3;
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


	if (this.y < canvas.height) {
		this.fallSpeed += delta * 2;
		if (this.fallSpeed > vMax) {
			this.fallSpeed = vMax;
		}
	} else {
		this.fallSpeed = 0;
	}
};

Critter.prototype.move = function() {
	this.x += this.speed;
	this.y += this.fallSpeed;

	if (this.y > canvas.height) {
		this.y = canvas.height;
	}
}

Critter.prototype.render = function() {
	var halfWidth = this.size * this.width/2;
	var top = this.top();
	var bottom = this.y;
	var hMid = this.x;

	var wobble = Math.sin((game.tick - this.birthTick) / 5) * 2.5 - this.speed; 
	var stretch = this.fallSpeed * 2;

	ctx.beginPath();
	
	ctx.moveTo(hMid, bottom);
	ctx.lineTo(hMid - halfWidth, bottom);
	ctx.bezierCurveTo(hMid + wobble - halfWidth, top - stretch, hMid + wobble + halfWidth, top - stretch, hMid + halfWidth, bottom);
	ctx.lineTo(hMid, bottom);

	this.drawPath();
}

Critter.prototype.navToTarget = function() {
	if (this.target && this.target.dead) {
		this.target = null;
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
}
