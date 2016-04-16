Class.makeClass(Critter, function Player(x, y, width, height) {
	this.init();

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.r = 220;
	this.b = 220;
});

Player.prototype.update = function() {
	var x = 0;
	var y = 0;
	if (keysHeld.left) {
		x -= 1;
	}
	if (keysHeld.right) {
		x += 1;
	}

	this.accelerate(x, y);

	this.move();
}
