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

BodyPart.prototype.parentDrawPath = BodyPart.prototype.drawPath;
BodyPart.prototype.drawPath = function() {
	this.a = this.owner.a;
	this.parentDrawPath();
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
	var bottom = this.owner.y + (this.owner.size * this.y);
	var hMid = this.owner.x + (this.owner.size * this.x);

	var left = hMid - halfWidth;
	var right = hMid + halfWidth;

	var wobble = this.owner.wobble;
	var smallWobble = wobble/2;
	var stretch = this.owner.stretch;
	
	ctx.moveTo(left, bottom);

	if (this.type == 'platform') {
		var shallowWidth = halfWidth / 2;
		var vMid = bottom - (this.owner.size * this.owner.height/2);

		ctx.quadraticCurveTo(left + shallowWidth + smallWobble, vMid, left, top);
		ctx.lineTo(right, top);
		ctx.quadraticCurveTo(right - shallowWidth - smallWobble, vMid, right, bottom);
		ctx.lineTo(left, bottom);
	} else {
		if (this.owner.stiffness) {
			ctx.lineTo(hMid + wobble, top - stretch);
			ctx.lineTo(hMid + halfWidth, bottom);
		} else {
			ctx.bezierCurveTo(hMid + wobble - halfWidth, top - stretch, hMid + wobble + halfWidth, top - stretch, hMid + halfWidth, bottom);
		}
		ctx.bezierCurveTo(hMid + smallWobble + halfWidth, this.owner.y, hMid + smallWobble - halfWidth, this.owner.y, hMid - halfWidth, bottom);
	}
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
	var top = this.owner.top() + this.y;
	var bottom = this.owner.y;
	var vAnchor = bottom + this.owner.size * (this.owner.body.y + this.y);
	var hAnchor = this.owner.x + (this.owner.size * this.x);

	var dir = this.flip ? -1 : 1;

	var span = this.owner.x - dir * (-30 + this.y * this.owner.size * 1);
	var offset = 5 - (this.y/5);

	var wobble = this.owner.wobble;
	var stretch = this.owner.stretch;

	var footHeight = 4 * this.owner.fastAmp * this.owner.animSpeed();
	var footDist = -1 * this.owner.fastAmp * this.owner.animSpeed();

	ctx.moveTo(hAnchor, vAnchor);
	ctx.quadraticCurveTo(span + wobble, top - stretch, span + (footDist), bottom + (dir * footHeight));
	ctx.quadraticCurveTo(span + wobble - (dir * offset), top - stretch + offset, hAnchor + (dir * offset), vAnchor + offset); 
}




/* BODY PART: Wing (unused) */

Class.makeClass(BodyPart, function WingPart(x, y, owner, flip) {
	this.init();

	this.x = x;
	this.y = y;
	this.flip = flip;

	this.setOwner(owner);
});

WingPart.prototype.definePath = function() {
	var halfWidth = this.owner.size * this.owner.width/2;
	var top = this.owner.top();
	var bottom = this.owner.y;
	var vAnchor = bottom + this.owner.size * (this.owner.body.y + this.y);
	var hAnchor = this.owner.x + (this.owner.size * this.x);

	var vMid = top + (this.owner.height/2 * this.owner.size);

	top += 10;

	var dir = this.flip ? -1 : 1;

	var span = this.owner.x - dir * (-40 * this.owner.size);
	var offset = 5 - (this.y/5);

	var wobble = this.owner.wobble;
	var stretch = this.owner.stretch;

	var footHeight = 4 * this.owner.fastAmp * this.owner.animSpeed();
	var footDist = -1 * this.owner.fastAmp * this.owner.animSpeed();

	var flap = Math.abs(15 * (this.owner.rawAmp) * this.owner.animSpeed());

	ctx.moveTo(hAnchor, vAnchor);
	ctx.quadraticCurveTo(span + wobble, bottom, span, top - offset + flap);
	ctx.lineTo(span + (dir * offset * 2), top + flap);
	ctx.quadraticCurveTo(span + wobble, bottom, hAnchor, vAnchor);
}
