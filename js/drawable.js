Class.makeClass(Point, function Drawable(x, y) {
	this.init();

	this.x = x;
	this.y = y;
});

Drawable.prototype.left = function() { return this.x; }
Drawable.prototype.right = function() { return this.x; }
Drawable.prototype.top = function() { return this.y; }
Drawable.prototype.bottom = function() { return this.y; }

Drawable.prototype.isTouching = function(other) {
	var bb = this.getBounds();
	return other.getBounds().intersects(bb);
}

Drawable.prototype.getBounds = function() {
	var l = this.left();
	var t = this.top();
	var r = this.right();
	var b = this.bottom();
	return new Rectangle(l, t, r-l, b-t);
}

Drawable.prototype.init = function() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 1;
}

Drawable.prototype.getColor = function() {
	return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
}

Drawable.prototype.definePath = function() {
}

Drawable.prototype.render = function() {
	ctx.beginPath();
	this.definePath();
	this.drawPath();
}

Drawable.prototype.drawPath = function() {
	ctx.fillStyle = this.getColor();
	ctx.fill();

	ctx.strokeStyle = 'black';
	ctx.stroke();
}
