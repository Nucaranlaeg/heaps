"use strict";
class Upgrade {
    constructor(name, description, upgrade) {
        this.name = name;
        this.description = description;
        this.upgrade = upgrade;
    }
}
const upgrades = {
    wall: new Upgrade("Wall", "Add little walls to the edge, reducing the sand that spills over each edge into the void by 0.1/s.", (heap, action) => {
        const upgradeCost = 2 /* WALL_UPGRADE.FACTOR */ ** (heap.sandWall / 0.1 /* WALL_UPGRADE.VALUE */) * 5 /* WALL_UPGRADE.BASE */;
        if (action === "get") {
            return upgradeCost;
        }
        else if (action === "buy") {
            if (heap.sand >= upgradeCost) {
                heap.sand -= upgradeCost;
                heap.sandWall += 0.1 /* WALL_UPGRADE.VALUE */;
                return true;
            }
            return false;
        }
        else {
            throw new Error("Attempted an illegal buy action");
        }
    }),
    increaseSandGain: new Upgrade("Sand Gain", "Increase the amount of sand that pours onto the initial square.", (heap, action) => {
        if (!(heap instanceof SandGainHeap))
            return false;
        const upgradeCost = 5 /* SAND_GAIN_UPGRADE.FACTOR */ ** heap.upgradesBought * 10 /* SAND_GAIN_UPGRADE.BASE */;
        if (action === "get") {
            return upgradeCost;
        }
        else if (action === "buy") {
            if (heap.sand >= upgradeCost) {
                heap.sand -= upgradeCost;
                heap.upgradesBought++;
                sandGain += 1 /* SAND_GAIN_UPGRADE.VALUE */;
                return true;
            }
            return false;
        }
        else {
            throw new Error("Attempted an illegal buy action");
        }
    }),
    delete: new Upgrade("Delete", "Remove a heap that you don't want.", (heap, action) => {
        if (action === "get") {
            return 0;
        }
        else if (action === "buy") {
            if (confirm("Really delete this heap?")) {
                heaps.splice(heaps.findIndex(h => h === heap), 1);
                redraw();
            }
            return true;
        }
        else {
            throw new Error("Attempted an illegal buy action");
        }
    }),
};
//# sourceMappingURL=upgrade.js.map