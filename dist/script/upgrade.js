"use strict";
class Upgrade {
    constructor(name, description, upgrade) {
        this.name = name;
        this.description = description;
        this.upgrade = upgrade;
    }
}
const upgrades = {
    wall: new Upgrade("Wall", "Add little walls to the edge, reducing the sand that spills over each edge into the void by up to 0.1/s.  (Default is 10% of the heap's sand per second per void)", (heap, action) => {
        const index = heap.upgrades.findIndex(u => u.name === "Wall");
        if (!heap.upgradesBought[index])
            heap.upgradesBought[index] = 0;
        const upgradeCost = 2 /* WALL_UPGRADE.FACTOR */ ** heap.upgradesBought[index] * 5 /* WALL_UPGRADE.BASE */;
        if (action === "get") {
            return upgradeCost;
        }
        else if (action === "buy") {
            if (heap.sand >= upgradeCost) {
                heap.sand -= upgradeCost;
                heap.sandWall += 0.1 /* WALL_UPGRADE.VALUE */;
                heap.upgradesBought[index] = (heap.upgradesBought[index] || 0) + 1;
                return true;
            }
            return false;
        }
        else {
            throw new Error("Attempted an illegal buy action");
        }
    }),
    sandBoost: new Upgrade("Sand Boost", "Slightly increase sand gained.  Increase is 1% per log_10(sand) per level.", (heap, action) => {
        const index = heap.upgrades.findIndex(u => u.name === "Sand Boost");
        if (!heap.upgradesBought[index])
            heap.upgradesBought[index] = 0;
        const upgradeCost = 1.5 /* SAND_BOOST_UPGRADE.FACTOR */ ** heap.upgradesBought[index] * 100 /* SAND_BOOST_UPGRADE.BASE */;
        if (action === "get") {
            return upgradeCost;
        }
        else if (action === "buy") {
            if (heap.sand >= upgradeCost) {
                heap.sand -= upgradeCost;
                heap.upgradesBought[index] = (heap.upgradesBought[index] || 0) + 1;
                return true;
            }
            return false;
        }
        else {
            throw new Error("Attempted an illegal buy action");
        }
    }),
    increaseSandGain: new Upgrade("Sand Gain", "Increase the amount of sand that pours onto the initial heap.", (heap, action) => {
        if (!(heap instanceof SandGainHeap))
            return false;
        const index = heap.upgrades.findIndex(u => u.name === "Sand Gain");
        if (!heap.upgradesBought[index])
            heap.upgradesBought[index] = 0;
        const upgradeCost = 5 /* SAND_GAIN_UPGRADE.FACTOR */ ** heap.upgradesBought[index] * 10 /* SAND_GAIN_UPGRADE.BASE */;
        if (action === "get") {
            return upgradeCost;
        }
        else if (action === "buy") {
            if (heap.sand >= upgradeCost) {
                heap.sand -= upgradeCost;
                sandGain += 1 /* SAND_GAIN_UPGRADE.VALUE */;
                heap.upgradesBought[index] = heap.upgradesBought[index] + 1;
                return true;
            }
            return false;
        }
        else {
            throw new Error("Attempted an illegal buy action");
        }
    }),
    decreaseHeapCost: new Upgrade("Heap Cost", "Decrease the cost of your next heap by 20%.", (heap, action) => {
        if (!(heap instanceof ExtraHeapsHeap))
            return false;
        const index = heap.upgrades.findIndex(u => u.name === "Heap Cost");
        if (!heap.upgradesBought[index])
            heap.upgradesBought[index] = 0;
        const upgradeCost = 1.3 /* EXTRA_HEAPS_UPGRADE.FACTOR */ ** heap.upgradesBought[index] * 25 /* EXTRA_HEAPS_UPGRADE.BASE */;
        if (action === "get") {
            return upgradeCost;
        }
        else if (action === "buy") {
            if (heap.sand >= upgradeCost) {
                heap.sand -= upgradeCost;
                heapCostMult *= 0.8 /* EXTRA_HEAPS_UPGRADE.VALUE */;
                heap.upgradesBought[index] = heap.upgradesBought[index] + 1;
                document.querySelector("#next-heap-cost .cost").innerHTML = writeNumber(tryBuyHeap("get"));
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
            heaps.splice(heaps.findIndex(h => h === heap), 1);
            redraw();
            return true;
        }
        else {
            throw new Error("Attempted an illegal buy action");
        }
    }),
};
//# sourceMappingURL=upgrade.js.map