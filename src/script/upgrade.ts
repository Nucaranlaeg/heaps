class Upgrade {
	name: string;
	description: string;
	upgrade: (heap: Heap, action: "get" | "buy") => number | boolean;
	constructor(name: string, description: string, upgrade: Upgrade["upgrade"]){
		this.name = name;
		this.description = description;
		this.upgrade = upgrade;
	}
}

const upgrades = {
	wall: new Upgrade("Wall", "Add little walls to the edge, reducing the sand that spills over each edge into the void by 0.1/s.", (heap: Heap, action: "get" | "buy") => {
		const upgradeCost = WALL_UPGRADE.FACTOR ** (heap.sandWall / WALL_UPGRADE.VALUE) * WALL_UPGRADE.BASE;
		if (action === "get"){
			return upgradeCost;
		} else if (action === "buy"){
			if (heap.sand >= upgradeCost){
				heap.sand -= upgradeCost;
				heap.sandWall += WALL_UPGRADE.VALUE;
				return true;
			}
			return false;
		} else {
			throw new Error("Attempted an illegal buy action");
		}
	}),
	increaseSandGain: new Upgrade("Sand Gain", "Increase the amount of sand that pours onto the initial square.", (heap: Heap, action: "get" | "buy") => {
		if (!(heap instanceof SandGainHeap)) return false;
		const upgradeCost = SAND_GAIN_UPGRADE.FACTOR ** heap.upgradesBought * SAND_GAIN_UPGRADE.BASE;
		if (action === "get"){
			return upgradeCost;
		} else if (action === "buy"){
			if (heap.sand >= upgradeCost){
				heap.sand -= upgradeCost;
				heap.upgradesBought++;
				sandGain += SAND_GAIN_UPGRADE.VALUE;
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
			if (confirm("Really delete this heap?")){
				heaps.splice(heaps.findIndex(h => h === heap), 1);
				redraw();
			}
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

const enum SAND_GAIN_UPGRADE {
	BASE = 10,
	FACTOR = 5,
	VALUE = 1,
}
