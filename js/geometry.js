function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Point.prototype.normalize = function() {
	var length = this.length();
	return new Point(this.x/length, this.y/length);
}

Point.prototype.length = function() {
	return Math.sqrt(this.lenSqrd());
}

Point.prototype.lenSqrd = function() {
	return (this.x * this.x) + (this.y * this.y);
}

Point.prototype.distTo = function(other) {
	return this.minus(other).length();
}

Point.prototype.isZero = function() {
	return !(this.x || this.y);
}

Point.prototype.times = function(mult) {
	return new Point(this.x * mult, this.y * mult);
}

Point.prototype.toRect = function(width, height, centered) {
	var left = this.x;
	var top = this.y;
	if (centered) {
		left -= width / 2.0;
		top -= height / 2.0;
	}
	return new Rectangle(left, top, width, height);
}


Point.prototype.offsetBy = function(other) {
	this.x += other.x;
	this.y += other.y;
	return this;
}

Point.prototype.plus = function(other) {
	return this.clone().offsetBy(other);
}

Point.prototype.minus = function(other) {
	return this.clone().offsetBy(other.times(-1));
}

Point.prototype.clone = function() {
	return new Point(this.x, this.y);
}




function Rectangle(left, top, width, height) {
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
	
	Object.defineProperty(this, 'right', {
		get: function() {
			return this.left + this.width;
		}
	});
	
	Object.defineProperty(this, 'bottom', {
		get: function() {
			return this.top + this.height;
		}
	});
}

Rectangle.prototype.intersects = function(other) {
	return (
		this.left < other.right && this.right > other.left
	&&
		this.top < other.bottom && this.bottom > other.top
	);
}

Rectangle.prototype.clone = function() {
	return new Rectangle(this.left, this.top, this.width, this.height);
}
