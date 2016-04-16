Class.makeClass(Mob, function Bush(x, y, size) {
	this.init();

	this.x = x;
	this.y = y;
	this.size = size;

	this.g = 120;
});

Bush.prototype.left = function() { return this.x - this.size; }
Bush.prototype.right = function() { return this.x + this.size; }
Bush.prototype.top = function() { return this.y - this.size; }
Bush.prototype.bottom = function() { return this.y + this.size; }


Bush.prototype.render = function() {
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
	this.drawPath();
}

Bush.prototype.update = function() {
	if (this.spawn) {
		if (this.spawn.grabbedBy) {
			this.spawn = null;
		}
	} else {
		if (Math.random() < 0.001) {
			var berry = new Berry(this.x, this.y, 5);
			game.mobs.push(berry);
			this.spawn = berry;
		}
	}
}
