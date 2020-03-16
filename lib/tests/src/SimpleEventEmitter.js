"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class SimpleEventEmitter {
    constructor() {
        this.onListeners = {};
        this.onceListeners = {};
    }
    on(event, callback) {
        (this.onListeners[event]) = union(this.onListeners[event], [callback]);
    }
    once(event, callback) {
        this.onceListeners[event] = union(this.onceListeners[event], [callback]);
    }
    off(event, callback) {
        this.onListeners[event] = without(this.onListeners[event], callback);
        this.onceListeners[event] = without(this.onceListeners[event], callback);
    }
    emit(event, ...args) {
        if (this.onListeners[event]) {
            for (const callback of this.onListeners[event]) {
                callback.call(null, ...args);
            }
        }
        if (this.onceListeners[event] && this.onceListeners[event].length > 0) {
            for (const callback of this.onceListeners[event]) {
                callback.call(null, ...args);
            }
            this.onceListeners[event] = [];
        }
    }
    emitAndWaitForCompletion(event, ...args) {
        const promises = [];
        if (this.onListeners[event]) {
            for (const callback of this.onListeners[event]) {
                try {
                    promises.push(Promise.resolve(callback.call(null, ...args)));
                }
                catch (e) {
                    promises.push(Promise.reject(e));
                }
            }
        }
        if (this.onceListeners[event] && this.onceListeners[event].length > 0) {
            for (const callback of this.onceListeners[event]) {
                try {
                    promises.push(Promise.resolve(callback.call(null, ...args)));
                }
                catch (e) {
                    promises.push(Promise.reject(e));
                }
            }
            this.onceListeners[event] = [];
        }
        return Promise.all(promises).then((results) => {
            return;
        });
    }
}
exports.SimpleEventEmitter = SimpleEventEmitter;
//# sourceMappingURL=SimpleEventEmitter.js.map