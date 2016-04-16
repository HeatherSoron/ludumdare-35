Class.makeClass(Point, function Mob(x, y, width, height) {
	this.init();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
});

Mob.prototype.left = function() { return this.x; }
Mob.prototype.right = function() { return this.x; }
Mob.prototype.top = function() { return this.y; }
Mob.prototype.bottom = function() { return this.y; }

Mob.prototype.isTouching = function(other) {
	var bb = this.getBounds();
	return other.getBounds().intersects(bb);
}

Mob.prototype.getBounds = function() {
	var l = this.left();
	var t = this.top();
	var r = this.right();
	var b = this.bottom();
	return new Rectangle(l, t, r-l, b-t);
}

Mob.prototype.kill = function() {
	this.dead = true;
}

Mob.prototype.init = function() {
	this.speed = 0;
	this.fallSpeed = 0;
	this.birthTick = game.tick;

	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 1;
}

Mob.prototype.getColor = function() {
	return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
}

Mob.prototype.render = function() {
}

Mob.prototype.drawPath = function() {
	ctx.fillStyle = this.getColor();
	ctx.fill();

	ctx.strokeStyle = 'black';
	ctx.stroke();
}

Mob.prototype.update = function() {
}
