"use strict";
const ADJACENT_HEAPS = 4;
const HEAP_BASE_COST = 5;
let heapChanges = false;
class Heap {
    constructor(x, y, type = 0 /* HEAP_TYPE.STANDARD */) {
        this.adjacent = [];
        this.incomingSand = 0;
        this.node = null;
        this.upgrades = [];
        this.sand = 0;
        this.sandWall = 0;
        this.sandMove = 0.01;
        this.x = x;
        this.y = y;
        this.heapType = type;
        this.upgrades = [upgrades.wall];
        if (this.x !== 0 || this.y !== 0) {
            this.upgrades.push(upgrades.delete);
        }
    }
    tick() {
        if (this.x === 0 && this.y === 0) {
            this.sand += sandGain * TIME_FACTOR;
        }
        if (heapChanges) {
            this.adjacent = getAdjacentHeaps(this.x, this.y);
        }
        const sandTransfer = this.sandOutflow("heap");
        const sandVoid = this.sandOutflow("void");
        this.sand -= sandTransfer * this.adjacent.length + sandVoid * (ADJACENT_HEAPS - this.adjacent.length);
        this.adjacent.forEach(a => a.incomingSand += sandTransfer);
    }
    sandOutflow(to) {
        let sandTransfer = this.sand * this.sandMove * TIME_FACTOR;
        if (to === "void") {
            sandTransfer = Math.max(sandTransfer - (this.sandWall * TIME_FACTOR), 0);
        }
        return sandTransfer;
    }
    cleanupTick() {
        this.sand += this.incomingSand;
        this.incomingSand = 0;
        if (this.upgrades.some(u => u.name !== "Delete" && (u.upgrade(this, "get")) < this.sand)) {
            this.node?.classList.add("ready");
        }
        else {
            this.node?.classList.remove("ready");
        }
    }
}
class SandGainHeap extends Heap {
    constructor(x, y) {
        super(x, y, 1 /* HEAP_TYPE.SAND_GAIN */);
        this.upgradesBought = 0;
        this.upgrades = [upgrades.increaseSandGain];
    }
    sandOutflow() {
        return 0;
    }
    tick() { }
}
function getAdjacentHeaps(x, y) {
    return [
        getHeap(x - 1, y),
        getHeap(x + 1, y),
        getHeap(x, y - 1),
        getHeap(x, y + 1),
    ].filter(h => h !== null);
}
function getHeap(x, y) {
    return heaps.find(h => h.x === x && h.y === y) || null;
}
function addHeap(x, y, heapType = 0 /* HEAP_TYPE.STANDARD */) {
    if (getHeap(x, y))
        return;
    let newHeap;
    switch (heapType) {
        case 0 /* HEAP_TYPE.STANDARD */:
            newHeap = new Heap(x, y);
            break;
        case 1 /* HEAP_TYPE.SAND_GAIN */:
            newHeap = new SandGainHeap(x, y);
            break;
        default:
            throw new Error("Attempted to create invalid heap type.");
    }
    heaps.push(newHeap);
    addFixedHeaps();
    heapChanges = true;
}
function tryBuyHeap(action) {
    const heapCost = Math.pow(HEAP_BASE_COST, heaps.filter(h => h.heapType === 0 /* HEAP_TYPE.STANDARD */).length);
    if (action === "get")
        return heapCost;
    if ((getHeap(0, 0)?.sand || 0) > heapCost) {
        getHeap(0, 0).sand -= heapCost;
        return true;
    }
    return false;
}
let heapViewTasks = [];
function selectHeap(heap) {
    const selectionStats = document.querySelector("#selection-stats");
    const selectionUpgrades = document.querySelector("#selection-upgrades");
    if (!clearNode(selectionStats))
        return;
    if (!clearNode(selectionUpgrades))
        return;
    const resourceTemplate = document.querySelector("#resource-template");
    const sandNode = resourceTemplate.cloneNode(true);
    sandNode.removeAttribute("id");
    sandNode.querySelector(".name").innerHTML = "Sand";
    heapViewTasks.push(() => sandNode.querySelector(".count").innerHTML = writeNumber(heap.sand, 1));
    selectionStats.appendChild(sandNode);
    const inflowNode = resourceTemplate.cloneNode(true);
    inflowNode.removeAttribute("id");
    inflowNode.querySelector(".name").innerHTML = "Inflow";
    heapViewTasks.push(() => {
        let inflow = heap.adjacent.reduce((a, c) => a + c.sandOutflow("heap"), 0) / TIME_FACTOR;
        if (heap.x === 0 && heap.y === 0)
            inflow += sandGain;
        inflowNode.querySelector(".count").innerHTML = writeNumber(inflow, 2) + "/s";
    });
    selectionStats.appendChild(inflowNode);
    const outflowNode = resourceTemplate.cloneNode(true);
    outflowNode.removeAttribute("id");
    outflowNode.querySelector(".name").innerHTML = "Outflow";
    heapViewTasks.push(() => {
        const outflow = (heap.sandOutflow("heap") * heap.adjacent.length + heap.sandOutflow("void") * (ADJACENT_HEAPS - heap.adjacent.length)) / TIME_FACTOR;
        outflowNode.querySelector(".count").innerHTML = writeNumber(outflow, 2) + "/s";
    });
    selectionStats.appendChild(outflowNode);
    const lossNode = resourceTemplate.cloneNode(true);
    lossNode.removeAttribute("id");
    lossNode.querySelector(".name").innerHTML = "Loss";
    heapViewTasks.push(() => {
        const loss = heap.sandOutflow("void") * (ADJACENT_HEAPS - heap.adjacent.length) / TIME_FACTOR;
        lossNode.querySelector(".count").innerHTML = writeNumber(loss, 2) + "/s";
    });
    selectionStats.appendChild(lossNode);
    const upgradeTemplate = document.querySelector("#upgrade-template");
    for (const upgrade of heap.upgrades) {
        const upgNode = upgradeTemplate.cloneNode(true);
        upgNode.removeAttribute("id");
        upgNode.querySelector(".name").innerHTML = upgrade.name;
        upgNode.querySelector(".description").innerHTML = upgrade.description;
        upgNode.querySelector(".cost").innerHTML = writeNumber(upgrade.upgrade(heap, "get"));
        upgNode.onclick = () => {
            upgrade.upgrade(heap, "buy");
            upgNode.querySelector(".cost").innerHTML = writeNumber(upgrade.upgrade(heap, "get"));
        };
        if (upgrade.name === "Delete") {
            upgNode.classList.add("delete");
        }
        selectionUpgrades.appendChild(upgNode);
    }
    updateHeapView();
    document.querySelectorAll(".selected-heap").forEach(node => node.classList.remove("selected-heap"));
    heap.node.classList.add("selected-heap");
}
function updateHeapView() {
    heapViewTasks.forEach(task => task());
}
//# sourceMappingURL=heap.js.map