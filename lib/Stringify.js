"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_MOCKER_NAME = exports.printObject = void 0;
const INTERNAL_MOCKER_NAME = "__internalMocker";
exports.INTERNAL_MOCKER_NAME = INTERNAL_MOCKER_NAME;
function GetMockerDataSafe(mock) {
    const internalMocker = mock[INTERNAL_MOCKER_NAME];
    return internalMocker !== null && internalMocker !== void 0 ? internalMocker : null;
}
const defaultIndent = "  ";
function printString(object) {
    if (typeof object === "symbol" || typeof object === "number") {
        return String(object);
    }
    return `"${String(object).replace(/"/g, "\\\"").replace(/\\?'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n")}"`;
}
function printObject(object) {
    const alreadySeenObjects = [];
    const printObjectCapture = (objectCaptured, indent = defaultIndent) => {
        if (objectCaptured === null) {
            return "null";
        }
        if (objectCaptured === undefined) {
            return "undefined";
        }
        if (objectCaptured instanceof RegExp) {
            return objectCaptured.toString();
        }
        if (objectCaptured instanceof Date) {
            return `new Date("${objectCaptured.toISOString()}")`;
        }
        if (objectCaptured instanceof Error) {
            return `new Error(${objectCaptured.message})`;
        }
        if (alreadySeenObjects.indexOf(objectCaptured) !== -1) {
            return `[[Circular Object Reference]]`;
        }
        const mockerData = GetMockerDataSafe(objectCaptured);
        if (mockerData !== null) {
            return mockerData.mockName;
        }
        const typeofObject = typeof objectCaptured;
        if (typeofObject === "function" || typeofObject === "boolean" || typeofObject === "number" || typeofObject === "symbol") {
            return String(objectCaptured);
        }
        if (Array.isArray(objectCaptured)) {
            const arrayData = [];
            alreadySeenObjects.push(objectCaptured);
            for (const item of objectCaptured) {
                arrayData.push(`${indent}${printObjectCapture(item, indent + defaultIndent)}`);
            }
            alreadySeenObjects.pop();
            return `[\n${arrayData.join(",\n")}\n${indent.substr(defaultIndent.length)}]`;
        }
        if (objectCaptured instanceof Object) {
            alreadySeenObjects.push(objectCaptured);
            const keys = Reflect.ownKeys(objectCaptured);
            const keyStrings = [];
            for (const key of keys) {
                keyStrings.push(`${indent}${printString(key)}: ${printObjectCapture(Reflect.get(objectCaptured, key), indent + defaultIndent)}`);
            }
            alreadySeenObjects.pop();
            return `{\n${keyStrings.join(",\n")}\n${indent.substr(defaultIndent.length)}}`;
        }
        return printString(objectCaptured);
    };
    return printObjectCapture(object);
}
exports.printObject = printObject;
//# sourceMappingURL=Stringify.js.map