function addFixedHeaps(){
	const nonFixed = heaps.filter(h => h.heapType === HEAP_TYPE.STANDARD).length;
	addHeap(2, 1, HEAP_TYPE.SAND_GAIN);
	if (nonFixed > 1){
		addHeap(1, 3, HEAP_TYPE.SAND_GAIN);
		addHeap(-2, -2, HEAP_TYPE.EXTRA_HEAPS);
	}
	if (nonFixed > 2){
		addHeap(3, 2, HEAP_TYPE.EXTRA_HEAPS);
	}
}