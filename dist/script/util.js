"use strict";
function writeNumber(value, decimals = 0) {
    if (value < 0) {
        let neg = writeNumber(-value, decimals);
        if (!neg.match(/^0\.?0*$/))
            return `-${neg}`;
        return neg;
    }
    if (value < 10 ** -(decimals + 1))
        value = 0;
    if (value > 100)
        decimals = Math.min(decimals, 1);
    return value.toFixed(decimals);
}
function clearNode(node) {
    if (!node)
        return false;
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
    return true;
}
//# sourceMappingURL=util.js.map