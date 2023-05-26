const ADJACENT_HEAPS = 4;

let heapChanges = false;

class Heap {
	active: boolean;
	adjacent: Heap[] = [];
	incomingSand: number = 0;
	sand: number = 0;
	sandWall: number = 0;
	sandMove: number = 0.05;
	x: number;
	y: number;
	constructor(x: number, y: number, active: boolean){
		this.x = x;
		this.y = y;
		this.active = active;
	}

	tick(){
		if (this.x === 0 && this.y === 0){
			this.sand += sandGain;
		}
		if (heapChanges){
			this.adjacent = getAdjacentHeaps(this.x, this.y);
		}
		const sandTransfer = this.sand * this.sandMove;
		this.sand -= sandTransfer * ADJACENT_HEAPS;
		this.adjacent.forEach(a => a.incomingSand += sandTransfer);
		
		// Save sand from falling into the void with a wall
		const sandSaved = Math.min(this.sandWall, sandTransfer);
		this.sand += (ADJACENT_HEAPS - this.adjacent.length) * sandSaved;
	}

	cleanupTick(){
		this.sand += this.incomingSand;
		this.incomingSand = 0;
	}

	upgradeWall(action: "get" | "buy"){
		const upgradeCost = WALL_UPGRADE.FACTOR ** this.sandWall * WALL_UPGRADE.BASE;
		if (action === "get"){
			return upgradeCost;
		} else if (action === "buy"){
			if (this.sand >= upgradeCost){
				this.sandWall += WALL_UPGRADE.VALUE;
				return true;
			}
			return false;
		} else {
			throw new Error("Attempted an illegal buy action");
		}
	}
}

function getAdjacentHeaps(x: number, y: number): Heap[]{
	return [
		getHeap(x-1, y-1),
		getHeap(x-1, y+1),
		getHeap(x+1, y-1),
		getHeap(x+1, y+1),
	].filter(h => h !== null) as Heap[];
}

function getHeap(x: number, y: number){
	return heaps.find(h => h.x === x && h.y === y) || null;
}

function addHeap(x: number, y: number, active: boolean = false){
	heaps.push(new Heap(x, y, active));
	heapChanges = true;
}
