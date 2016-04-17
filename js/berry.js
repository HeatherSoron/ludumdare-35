Class.makeClass(Mob, function Berry(x, y, size, pathFunc, type) {
	this.init();
	if (pathFunc) {
		this.definePath = pathFunc;
	}

	this.x = x;
	this.y = y;
	this.size = size;
	this.type = type;

	this.r = 230;

	this.z = 3;
});

Berry.prototype.left = function() { return this.x - this.size; }
Berry.prototype.right = function() { return this.x + this.size; }
Berry.prototype.top = function() { return this.y - this.size; }
Berry.prototype.bottom = function() { return this.y + this.size; }


Berry.prototype.definePath = function() {
	ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
}

Berry.prototype.update = function() {
	if (this.grabbedBy) {
		this.x = this.grabbedBy.x;
		this.y = this.grabbedBy.y - (this.size + 2);
	}
}
