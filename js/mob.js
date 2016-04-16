Class.makeClass(null, function Mob(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.speed = 0;
});

Mob.prototype.accelerate = function(x, y) {
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

Mob.prototype.move = function() {
	this.x += this.speed;
}

Mob.prototype.render = function() {
	var halfWidth = this.width/2;
	var top = this.y - this.height;
	var bottom = this.y;
	var hMid = this.x + halfWidth;

	var wobble = Math.sin(game.tick / 5) * 2.5 - this.speed; 

	ctx.beginPath();
	
	ctx.moveTo(hMid, bottom);
	ctx.lineTo(hMid - halfWidth, bottom);
	ctx.bezierCurveTo(hMid + wobble - halfWidth, top, hMid + wobble + halfWidth, top, hMid + halfWidth, bottom);
	ctx.lineTo(hMid, bottom);

	ctx.stroke();
}
