var keysHeld = {};

function handleKeyDown(e) {
	var keyName = keyMap[e.keyCode];
	if (keyName && e.target.tagName != 'TEXTAREA') {
	console.log(keyName);
		keysHeld[keyName] = true;
		// e.preventDefault is used here to prevent scrolling when the spacebar is pressed
		e.preventDefault();
	}
}

function handleKeyUp(e) {
	var keyName = keyMap[e.keyCode];
	if (keyName && e.target.tagName != 'TEXTAREA') {
		keysHeld[keyName] = false;
		e.preventDefault();
	}
}
