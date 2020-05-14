"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortedArray = void 0;
class SortedArray {
    constructor(compare = compareDefault, initialValues = []) {
        this.array = [];
        this.compareFunction = compare || compareDefault;
        const length = initialValues.length;
        for (let i = 0; i < length; i++) {
            this.insert(initialValues[i]);
        }
    }
    getData() {
        return this.array;
    }
    insert(element) {
        let foundIndex = this.searchInternal(element) + 1;
        const highestIndex = this.array.length - 1;
        while ((foundIndex < highestIndex) && (this.compareFunction(element, this.array[foundIndex]) === 0)) {
            foundIndex++;
        }
        let index = this.array.length;
        this.array.push(element);
        while (index > foundIndex) {
            this.array[index] = this.array[--index];
        }
        this.array[foundIndex] = element;
    }
    search(element) {
        const foundIndex = this.searchInternal(element);
        if (this.compareFunction(this.array[foundIndex], element) !== 0) {
            return -1;
        }
        return foundIndex;
    }
    remove(element) {
        const index = this.search(element);
        if (index >= 0) {
            this.array.splice(index, 1);
        }
    }
    searchInternal(element) {
        let high = this.array.length - 1;
        let low = 0;
        let index;
        let ordering;
        while (high >= low) {
            index = Math.floor((high + low) / 2);
            ordering = this.compareFunction(this.array[index], element);
            if (ordering < 0) {
                low = index + 1;
            }
            else if (ordering > 0) {
                high = index - 1;
            }
            else {
                return index;
            }
        }
        return high;
    }
}
exports.SortedArray = SortedArray;
function compareDefault(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else {
        return 0;
    }
}
//# sourceMappingURL=SortedArray.js.map