Class.makeClass(null, function Mob(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
});

Mob.prototype.render = function() {
	var halfWidth = this.width/2;
	var top = this.y - this.height;
	var bottom = this.y;
	var hMid = this.x + halfWidth;

	var wobble = Math.sin(game.tick / 5) * 2.5 - game.speed; 

	ctx.beginPath();
	
	ctx.moveTo(hMid, bottom);
	ctx.lineTo(hMid - halfWidth, bottom);
	ctx.bezierCurveTo(hMid + wobble - halfWidth, top, hMid + wobble + halfWidth, top, hMid + halfWidth, bottom);
	ctx.lineTo(hMid, bottom);

	ctx.stroke();
}
