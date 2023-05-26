"use strict";
const ADJACENT_HEAPS = 4;
let heapChanges = false;
class Heap {
    constructor(x, y, active) {
        this.adjacent = [];
        this.incomingSand = 0;
        this.sand = 0;
        this.sandWall = 0;
        this.sandMove = 0.05;
        this.x = x;
        this.y = y;
        this.active = active;
    }
    tick() {
        if (this.x === 0 && this.y === 0) {
            this.sand += sandGain;
        }
        if (heapChanges) {
            this.adjacent = getAdjacentHeaps(this.x, this.y);
        }
        const sandTransfer = this.sand * this.sandMove;
        this.sand -= sandTransfer * ADJACENT_HEAPS;
        this.adjacent.forEach(a => a.incomingSand += sandTransfer);
        // Save sand from falling into the void with a wall
        const sandSaved = Math.min(this.sandWall, sandTransfer);
        this.sand += (ADJACENT_HEAPS - this.adjacent.length) * sandSaved;
    }
    cleanupTick() {
        this.sand += this.incomingSand;
        this.incomingSand = 0;
    }
    upgradeWall(action) {
        const upgradeCost = 2 /* WALL_UPGRADE.FACTOR */ ** this.sandWall * 5 /* WALL_UPGRADE.BASE */;
        if (action === "get") {
            return upgradeCost;
        }
        else if (action === "buy") {
            if (this.sand >= upgradeCost) {
                this.sandWall += 1 /* WALL_UPGRADE.VALUE */;
                return true;
            }
            return false;
        }
        else {
            throw new Error("Attempted an illegal buy action");
        }
    }
}
function getAdjacentHeaps(x, y) {
    return [
        getHeap(x - 1, y - 1),
        getHeap(x - 1, y + 1),
        getHeap(x + 1, y - 1),
        getHeap(x + 1, y + 1),
    ].filter(h => h !== null);
}
function getHeap(x, y) {
    return heaps.find(h => h.x === x && h.y === y) || null;
}
function addHeap(x, y, active = false) {
    heaps.push(new Heap(x, y, active));
    heapChanges = true;
}
//# sourceMappingURL=heap.js.map