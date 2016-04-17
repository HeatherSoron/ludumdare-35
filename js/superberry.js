// SuperBerry is NOT an instance of Berry. This is handy for me, actually, because I don't want critters eating them!
Class.makeClass(Berry, function SuperBerry(x, y, size, pathFunc, type) {
	this.init();
	if (pathFunc) {
		this.definePath = pathFunc;
	}

	this.x = x;
	this.y = y;
	this.size = size;
	this.type = type;

	this.g = 170;

	this.bushSize = size * 3;
	this.z = 3;
});

SuperBerry.prototype.plant = function() {
	game.mobs.push(new Bush(this.x, this.y, this.bushSize, this.definePath, this.type));
	this.kill();
}
