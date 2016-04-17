Class.makeClass(Drawable, function BodyPart(x, y, owner, flip) {
	this.init();

	this.x = x;
	this.y = y;
	this.flip = flip;
	
	this.setOwner(owner);
});

BodyPart.prototype.clone = function(owner) {
	return new this.constructor(this.x, this.y, owner, this.flip);
}

BodyPart.prototype.setOwner = function(owner) {
	this.owner = owner;

	this.r = owner.r;
	this.g = owner.g;
	this.b = owner.b;
	this.a = owner.a;
}


/* BODY PART: SlimeBody */

Class.makeClass(BodyPart, function SlimeBody(x, y, owner, flip) {
	this.init();

	this.x = x;
	this.y = y;
	this.flip = flip;

	this.setOwner(owner);
});

SlimeBody.prototype.definePath = function() {
	var halfWidth = this.owner.size * this.owner.width/2;
	var top = this.owner.top();
	var bottom = this.owner.y;
	var hMid = this.owner.x;

	var wobble = this.owner.size * (Math.sin((game.tick - this.owner.birthTick) / (4.75 + this.owner.wobbleRate)) * 2.5 - this.owner.speed); 
	var stretch = this.owner.size * this.owner.fallSpeed * 2;

	var side = halfWidth + this.owner.stiffness * 100 * this.owner.size;
	
	ctx.moveTo(hMid, bottom);
	ctx.lineTo(hMid - halfWidth, bottom);
	if (this.owner.stiffness) {
		ctx.lineTo(hMid + wobble, top - stretch);
		ctx.lineTo(hMid + halfWidth, bottom);
	} else {
		ctx.bezierCurveTo(hMid + wobble - side, top - stretch, hMid + wobble + side, top - stretch, hMid + halfWidth, bottom);
	}
	ctx.lineTo(hMid, bottom);
}



/* BODY PART: Leg */

Class.makeClass(BodyPart, function LegPart(x, y, owner, flip) {
	this.init();

	this.x = x;
	this.y = y;
	this.flip = flip;

	this.setOwner(owner);
});

LegPart.prototype.definePath = function() {
	var halfWidth = this.owner.size * this.owner.width/2;
	var top = this.owner.top();
	var bottom = this.owner.y;
	var vAnchor = bottom + (this.owner.size * this.y);
	var hAnchor = this.owner.x + (this.owner.size * this.x);

	var dir = this.flip ? -1 : 1;

	var span = this.owner.x - (dir * this.y * this.owner.size * 3);
	var offset = -this.y / 2;

	var wobble = this.owner.size * (Math.sin((game.tick - this.owner.birthTick) / (4.75 + this.owner.wobbleRate)) * 2.5 - this.owner.speed); 
	var stretch = this.owner.size * this.owner.fallSpeed * 2;

	var side = halfWidth + this.owner.stiffness * 100 * this.owner.size;

	ctx.moveTo(hAnchor, vAnchor);
	ctx.quadraticCurveTo(span + wobble, top - stretch, span, bottom);
	ctx.quadraticCurveTo(span + wobble - (dir * offset), top - stretch + offset, hAnchor + (dir * offset), vAnchor + offset); 

	return;
	
	ctx.moveTo(hMid, bottom);
	ctx.lineTo(hMid - halfWidth, bottom);
	if (this.owner.stiffness) {
		ctx.lineTo(hMid + wobble, top - stretch);
		ctx.lineTo(hMid + halfWidth, bottom);
	} else {
		ctx.bezierCurveTo(hMid + wobble - side, top - stretch, hMid + wobble + side, top - stretch, hMid + halfWidth, bottom);
	}
	ctx.lineTo(hMid, bottom);
}
