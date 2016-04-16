function Class() {
}

Class.makeClass = function(parent, def) {
	if (parent) {
		for (var key in parent.prototype) {
			def.prototype[key] = parent.prototype[key];
		}
	}
	if (!window[def.name]) {
		window[def.name] = def;
	} else {
		console.error("Trying to make a class with a pre-existing name!");
	}
	return def;
}

