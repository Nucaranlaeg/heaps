const CELL_SIZE = 50;

let heapPanel: HTMLElement;
let resourceTemplate: HTMLElement;
let buildTemplate: HTMLElement;

function getNodeReferences(){
	if (!heapPanel){
		heapPanel = document.querySelector("#grid-view")!;
		resourceTemplate = document.querySelector("#cell-template")!;
		resourceTemplate.removeAttribute("id");
		buildTemplate = document.querySelector("#build-template")!;
		buildTemplate.removeAttribute("id");
		(<HTMLElement>document.querySelector("#heaps")!).onmousedown = startPan;
		document.onmouseup = endPan;
	}
}

function redraw(){
	getNodeReferences();
	if (!clearNode(heapPanel)) return;
	const buildOptions: [number, number][] = [];
	heaps.forEach(h => {
		if (!h.node){
			h.node = resourceTemplate.cloneNode(true) as HTMLElement;
			h.node.style.top = `${CELL_SIZE * h.x}px`;
			h.node.style.left = `${CELL_SIZE * h.y}px`;
			const className =
				h.heapType === HEAP_TYPE.STANDARD ? "" :
				h.heapType === HEAP_TYPE.SAND_GAIN ? "sand-gain" :
				"";
			if (className !== "") h.node.classList.add(className);
			h.node.onclick = () => selectHeap(h);
		}
		heapPanel.appendChild(h.node);
		if (h.heapType == HEAP_TYPE.STANDARD){
			for (const adj of [[h.x-1,h.y],[h.x+1,h.y],[h.x,h.y-1],[h.x,h.y+1]]){
				if (!buildOptions.find(b => b[0] == adj[0] && b[1] == adj[1])){
					buildOptions.push(adj as [number, number]);
				}
			}
		}
	});
	for (const buildOption of buildOptions){
		if (getHeap(...buildOption)) continue;
		const buildNode = buildTemplate.cloneNode(true) as HTMLElement;
		buildNode.style.top = `${CELL_SIZE * buildOption[0]}px`;
		buildNode.style.left = `${CELL_SIZE * buildOption[1]}px`;
		buildNode.onclick = () => {
			if (tryBuyHeap("buy")) {
				addHeap(...buildOption);
				redraw();
			}
			document.querySelector("#next-heap-cost .cost")!.innerHTML = writeNumber(tryBuyHeap("get") as number);
		}
		heapPanel.appendChild(buildNode);
	}
	drawHeaps();
}

function drawHeaps(){
	heaps.forEach(h => {
		if (!h.node) return;
		h.node.querySelector(".count")!.innerHTML = writeNumber(h.sand);
	});
}

let totalStatsTasks: (() => void)[] = [];

function drawTotalStats(){
	const totalStats = document.querySelector("#total-stats")! as HTMLElement;
	if (!clearNode(totalStats)) return;
	
	const resourceTemplate = document.querySelector("#resource-template")!;
	const sandNode = resourceTemplate.cloneNode(true) as HTMLElement;
	sandNode.removeAttribute("id");
	sandNode.querySelector(".name")!.innerHTML = "Sand";
	heapViewTasks.push(() => {
		const totalSand = heaps.reduce((a, c) => a + (c.heapType === HEAP_TYPE.STANDARD ? c.sand : 0), 0);
		sandNode.querySelector(".count")!.innerHTML = writeNumber(totalSand, 1)
	});
	totalStats.appendChild(sandNode);
	
	const inflowNode = resourceTemplate.cloneNode(true) as HTMLElement;
	inflowNode.removeAttribute("id");
	inflowNode.querySelector(".name")!.innerHTML = "Inflow";
	heapViewTasks.push(() => {
		let inflow = sandGain;
		inflowNode.querySelector(".count")!.innerHTML = writeNumber(inflow, 2) + "/s";
	});
	totalStats.appendChild(inflowNode);

	const outflowNode = resourceTemplate.cloneNode(true) as HTMLElement;
	outflowNode.removeAttribute("id");
	outflowNode.querySelector(".name")!.innerHTML = "Outflow";
	heapViewTasks.push(() => {
		const outflow = heaps.reduce((a, c) => a + (c.heapType === HEAP_TYPE.STANDARD ? c.sandOutflow("void") * (ADJACENT_HEAPS - c.adjacent.filter(h => h.heapType === HEAP_TYPE.STANDARD).length) : 0), 0) / TIME_FACTOR;
		outflowNode.querySelector(".count")!.innerHTML = writeNumber(outflow, 2) + "/s";
	});
	totalStats.appendChild(outflowNode);

	const lossNode = resourceTemplate.cloneNode(true) as HTMLElement;
	lossNode.removeAttribute("id");
	lossNode.querySelector(".name")!.innerHTML = "Loss";
	heapViewTasks.push(() => {
		const loss = heaps.reduce((a, c) => a + (c.heapType === HEAP_TYPE.STANDARD ? c.sandOutflow("void") * (ADJACENT_HEAPS - c.adjacent.length) : 0), 0) / TIME_FACTOR;
		lossNode.querySelector(".count")!.innerHTML = writeNumber(loss, 2) + "/s";
	});
	totalStats.appendChild(lossNode);
}

function updateTotalStats(){
	totalStatsTasks.forEach(task => task());
}

let currentPanOffset = {
	x: 0,
	y: 0,
};
let isPanning = false;
let panLast = {
	x: 0,
	y: 0,
}

function startPan(event: MouseEvent){
	isPanning = true;
	panLast.x = event.x;
	panLast.y = event.y;
	document.onmousemove = continuePan;
}

function continuePan(event: MouseEvent){
	currentPanOffset.x -= panLast.x - event.x;
	currentPanOffset.y -= panLast.y - event.y;
	panLast.x = event.x;
	panLast.y = event.y;
	heapPanel.style.transform = `translateX(${currentPanOffset.x}px) translateY(${currentPanOffset.y}px)`;
}

function endPan(){
	isPanning = false;
	document.onmousemove = null;
}
