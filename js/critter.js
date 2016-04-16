Class.makeClass(Point, function Critter(x, y, width, height) {
	this.init();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.g = 255;
	this.a = 0.8;
});

Critter.prototype.init = function() {
	this.speed = 0;
	this.birthTick = game.tick;

	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 1;
}

Critter.prototype.getColor = function() {
	return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
}

Critter.prototype.accelerate = function(x, y) {
	var delta = 0.2;
	var decay = delta * 2;
	var max = 3;

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
};

Critter.prototype.move = function() {
	this.x += this.speed;
}

Critter.prototype.render = function() {
	var halfWidth = this.width/2;
	var top = this.y - this.height;
	var bottom = this.y;
	var hMid = this.x;

	var wobble = Math.sin((game.tick - this.birthTick) / 5) * 2.5 - this.speed; 

	ctx.beginPath();
	
	ctx.moveTo(hMid, bottom);
	ctx.lineTo(hMid - halfWidth, bottom);
	ctx.bezierCurveTo(hMid + wobble - halfWidth, top, hMid + wobble + halfWidth, top, hMid + halfWidth, bottom);
	ctx.lineTo(hMid, bottom);

	ctx.fillStyle = this.getColor();
	ctx.fill();

	ctx.strokeStyle = 'black';
	ctx.stroke();
}

Critter.prototype.update = function() {
}
