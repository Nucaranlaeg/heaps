"use strict";
function addFixedHeaps() {
    const nonFixed = heaps.filter(h => h.heapType === 0 /* HEAP_TYPE.STANDARD */).length;
    addHeap(2, 1, 1 /* HEAP_TYPE.SAND_GAIN */);
    if (nonFixed > 1) {
        addHeap(1, 3, 1 /* HEAP_TYPE.SAND_GAIN */);
    }
}
//# sourceMappingURL=fixed_heaps.js.map