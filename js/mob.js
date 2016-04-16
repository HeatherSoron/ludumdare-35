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

Mob.prototype.getBounds = function() {
	return new Rectangle(this.left(), this.top(), this.right(), this.bottom());
}

Mob.prototype.init = function() {
	this.speed = 0;
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
