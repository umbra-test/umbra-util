"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.without = exports.union = void 0;
function union(arrayA, arrayB) {
    if (!arrayA) {
        return arrayB ? arrayB : [];
    }
    if (!arrayB) {
        return arrayA;
    }
    for (const item of arrayB) {
        if (arrayA.indexOf(item) === -1) {
            arrayA.push(item);
        }
    }
    return arrayA;
}
exports.union = union;
function without(array, item) {
    if (!array) {
        return [];
    }
    const indexOfItem = array.indexOf(item);
    if (indexOfItem !== -1) {
        array.splice(indexOfItem, 1);
    }
    return array;
}
exports.without = without;
//# sourceMappingURL=ArrayUtils.js.map