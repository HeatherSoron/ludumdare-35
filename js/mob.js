Class.makeClass(Drawable, function Mob(x, y, width, height) {
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

Mob.prototype.kill = function() {
	this.dead = true;
}

// next time, I'll probably put in function overriding
Mob.prototype.parentInit = Mob.prototype.init;
Mob.prototype.init = function() {
	this.parentInit();

	this.z = 0;

	this.speed = 0;
	this.fallSpeed = 0;
	this.birthTick = game.tick;
}

Mob.prototype.update = function() {
}
