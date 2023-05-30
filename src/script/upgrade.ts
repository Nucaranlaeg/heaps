class Upgrade {
	name: string;
	description: string;
	upgrade: (heap: Heap, action: "get" | "buy") => number | boolean;
	constructor(name: string, description: string, upgrade: Upgrade["upgrade"]){
		this.name = name;
		this.description = description;
		this.upgrade = upgrade;
	}

	// buyUpgrade(heap: Heap, action: "get" | "buy"){
	// 	const index = heap.upgrades.findIndex(u => u === this);
	// 	if (!heap.upgradesBought[index]) heap.upgradesBought[index] = 0;
	// 	const upgradeCost = this.factor ** heap.upgradesBought[index] * this.base;
	// 	if (action === "get"){
	// 		return upgradeCost;
	// 	} else if (action === "buy"){
	// 		if (heap.sand >= upgradeCost){
	// 			heap.sand -= upgradeCost;
	// 			heap.sandWall += this.value;
	// 			heap.upgradesBought[index] = (heap.upgradesBought[index] || 0) + 1;
	// 			return true;
	// 		}
	// 		return false;
	// 	} else {
	// 		throw new Error("Attempted an illegal buy action");
	// 	}
	// }
}

const upgrades = {
	wall: new Upgrade("Wall", "Add little walls to the edge, reducing the sand that spills over each edge into the void by up to 0.1/s.  (Default is 10% of the heap's sand per second per void)", (heap: Heap, action: "get" | "buy") => {
		const index = heap.upgrades.findIndex(u => u.name === "Wall");
		if (!heap.upgradesBought[index]) heap.upgradesBought[index] = 0;
		const upgradeCost = WALL_UPGRADE.FACTOR ** heap.upgradesBought[index] * WALL_UPGRADE.BASE;
		if (action === "get"){
			return upgradeCost;
		} else if (action === "buy"){
			if (heap.sand >= upgradeCost){
				heap.sand -= upgradeCost;
				heap.sandWall += WALL_UPGRADE.VALUE;
				heap.upgradesBought[index] = (heap.upgradesBought[index] || 0) + 1;
				return true;
			}
			return false;
		} else {
			throw new Error("Attempted an illegal buy action");
		}
	}),
	sandBoost: new Upgrade("Sand Boost", "Slightly increase sand gained.  Increase is 1% per log_10(sand) per level.", (heap: Heap, action: "get" | "buy") => {
		const index = heap.upgrades.findIndex(u => u.name === "Sand Boost");
		if (!heap.upgradesBought[index]) heap.upgradesBought[index] = 0;
		const upgradeCost = SAND_BOOST_UPGRADE.FACTOR ** heap.upgradesBought[index] * SAND_BOOST_UPGRADE.BASE;
		if (action === "get"){
			return upgradeCost;
		} else if (action === "buy"){
			if (heap.sand >= upgradeCost){
				heap.sand -= upgradeCost;
				heap.upgradesBought[index] = (heap.upgradesBought[index] || 0) + 1;
				return true;
			}
			return false;
		} else {
			throw new Error("Attempted an illegal buy action");
		}
	}),
	increaseSandGain: new Upgrade("Sand Gain", "Increase the amount of sand that pours onto the initial heap.", (heap: Heap, action: "get" | "buy") => {
		if (!(heap instanceof SandGainHeap)) return false;
		const index = heap.upgrades.findIndex(u => u.name === "Sand Gain");
		if (!heap.upgradesBought[index]) heap.upgradesBought[index] = 0;
		const upgradeCost = SAND_GAIN_UPGRADE.FACTOR ** heap.upgradesBought[index] * SAND_GAIN_UPGRADE.BASE;
		if (action === "get"){
			return upgradeCost;
		} else if (action === "buy"){
			if (heap.sand >= upgradeCost){
				heap.sand -= upgradeCost;
				sandGain += SAND_GAIN_UPGRADE.VALUE;
				heap.upgradesBought[index] = heap.upgradesBought[index] + 1;
				return true;
			}
			return false;
		} else {
			throw new Error("Attempted an illegal buy action");
		}
	}),
	decreaseHeapCost: new Upgrade("Heap Cost", "Decrease the cost of your next heap by 20%.", (heap: Heap, action: "get" | "buy") => {
		if (!(heap instanceof ExtraHeapsHeap)) return false;
		const index = heap.upgrades.findIndex(u => u.name === "Heap Cost");
		if (!heap.upgradesBought[index]) heap.upgradesBought[index] = 0;
		const upgradeCost = EXTRA_HEAPS_UPGRADE.FACTOR ** heap.upgradesBought[index] * EXTRA_HEAPS_UPGRADE.BASE;
		if (action === "get"){
			return upgradeCost;
		} else if (action === "buy"){
			if (heap.sand >= upgradeCost){
				heap.sand -= upgradeCost;
				heapCostMult *= EXTRA_HEAPS_UPGRADE.VALUE;
				heap.upgradesBought[index] = heap.upgradesBought[index] + 1;
				document.querySelector("#next-heap-cost .cost")!.innerHTML = writeNumber(tryBuyHeap("get") as number);
				return true;
			}
			return false;
		} else {
			throw new Error("Attempted an illegal buy action");
		}
	}),
	delete: new Upgrade("Delete", "Remove a heap that you don't want.", (heap: Heap, action: "get" | "buy") => {
		if (action === "get"){
			return 0;
		} else if (action === "buy"){
			heaps.splice(heaps.findIndex(h => h === heap), 1);
			redraw();
			return true;
		} else {
			throw new Error("Attempted an illegal buy action");
		}
	}),
};

const enum WALL_UPGRADE {
	BASE = 5,
	FACTOR = 2,
	VALUE = 0.1,
}

const enum SAND_BOOST_UPGRADE {
	BASE = 100,
	FACTOR = 1.5,
	VALUE = 1,
}

const enum SAND_GAIN_UPGRADE {
	BASE = 10,
	FACTOR = 5,
	VALUE = 1,
}

const enum EXTRA_HEAPS_UPGRADE {
	BASE = 25,
	FACTOR = 1.3,
	VALUE = 0.8,
}
