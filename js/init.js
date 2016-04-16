function init() {
	initializeCanvas();
	initializeInput();

	// setupGameWorld and runGame may need to be defined on a per-game basis
	setupGameWorld();
	setInterval(runGame, 1000 / 30);
}

function initializeCanvas() {
	// fill in the global canvas-related variables
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
}

function initializeInput() {
	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);
}
