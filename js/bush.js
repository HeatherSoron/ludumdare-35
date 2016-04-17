Class.makeClass(Mob, function Bush(x, y, size, pathFunc, type) {
	this.init();
	if (pathFunc) {
		this.definePath = pathFunc;
	}

	this.x = x;
	this.y = y;
	this.size = size;
	this.type = type;

	this.g = 120;
	if (type == 'super') {
		this.r = 250;
		this.g = 220;
	}
});

Bush.prototype.left = function() { return this.x - this.size; }
Bush.prototype.right = function() { return this.x + this.size; }
Bush.prototype.top = function() { return this.y - this.size; }
Bush.prototype.bottom = function() { return this.y + this.size; }


Bush.prototype.definePath = function() {
	ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
}

Bush.prototype.render = function() {
	ctx.beginPath();
	this.definePath();
	this.drawPath();
}

Bush.prototype.update = function() {
	if (this.spawn) {
		if (this.spawn.grabbedBy || this.spawn.dead) {
			this.spawn = null;
		}
	} else {
		if (Math.random() < 0.001) {
			var pathFunc = this.definePath == Bush.prototype.definePath ? null : this.definePath;
			if (this.type == 'super') {
				var berry = new SuperBerry(this.x, this.y, this.size / 3, pathFunc, this.type);
			} else {
				var berry = new Berry(this.x, this.y, this.size / 4, pathFunc, this.type);
			}
			game.mobs.push(berry);
			this.spawn = berry;
		}
	}
}
