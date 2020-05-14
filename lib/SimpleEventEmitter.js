"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleEventEmitter = void 0;
const ArrayUtils_1 = require("./ArrayUtils");
class SimpleEventEmitter {
    constructor() {
        this.onListeners = {};
        this.onceListeners = {};
    }
    on(event, callback) {
        (this.onListeners[event]) = ArrayUtils_1.union(this.onListeners[event], [callback]);
    }
    once(event, callback) {
        this.onceListeners[event] = ArrayUtils_1.union(this.onceListeners[event], [callback]);
    }
    off(event, callback) {
        this.onListeners[event] = ArrayUtils_1.without(this.onListeners[event], callback);
        this.onceListeners[event] = ArrayUtils_1.without(this.onceListeners[event], callback);
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