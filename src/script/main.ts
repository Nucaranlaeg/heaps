// Time
let lastTick = Date.now();
let tickLength = 100;

// Globals
let sandGain = 1;

// Heaps
let heaps: Heap[] = [];

function tick(){
	if (Date.now() - lastTick < tickLength) return;
	lastTick += tickLength;
	heaps.forEach(h => h.active && h.tick());
	tickCleanup();
}

function tickCleanup(){
	heaps.forEach(h => h.active && h.cleanupTick());
	heapChanges = false;
}

function newGame(){
	heaps = [];
	addHeap(0, 0, true);
}

setInterval(tick, 100);

newGame();
