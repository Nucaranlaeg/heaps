function writeNumber(value: number, decimals = 0): string {
	if (value < 0){
		let neg = writeNumber(-value, decimals);
		if (!neg.match(/^0\.?0*$/)) return `-${neg}`;
		return neg;
	}
	if (value < 10 ** -(decimals + 1)) value = 0;
	if (value > 100) decimals = Math.min(decimals, 1);
	return value.toFixed(decimals);
}

function clearNode(node: HTMLElement){
	if (!node) return false;
	while (node.firstChild){
		node.removeChild(node.lastChild!);
	}
	return true;
}


const enum HEAP_TYPE {
	STANDARD = 0,
	SAND_GAIN = 1,
	EXTRA_HEAPS = 2,
}
