// Time
let lastTick = Date.now();
const TICK_LENGTH = 100;
const TIME_FACTOR = TICK_LENGTH / 1000;

// Globals
let sandGain = 1;

// Heaps
let heaps: Heap[] = [];

function tick(loopsThisTick = 0){
	if (Date.now() - lastTick < TICK_LENGTH) return;
	lastTick += TICK_LENGTH;
	heaps.forEach(h => h.tick());
	heaps.forEach(h => h.cleanupTick());
	heapChanges = false;
	if (loopsThisTick < 10){
		tick(loopsThisTick + 1);
	}
	if (loopsThisTick === 0){
		drawHeaps();
		updateHeapView();
		updateTotalStats();
	}
}

function newGame(){
	heaps = [];
	addHeap(0, 0);
	redraw();
	drawTotalStats();
}

setInterval(tick, 1000/60);

setTimeout(() => newGame());
