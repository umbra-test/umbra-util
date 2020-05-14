"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_MOCKER_NAME = exports.printObject = void 0;
const INTERNAL_MOCKER_NAME = "__internalMocker";
exports.INTERNAL_MOCKER_NAME = INTERNAL_MOCKER_NAME;
function GetMockerDataSafe(mock) {
    const internalMocker = mock[INTERNAL_MOCKER_NAME];
    return internalMocker !== null && internalMocker !== void 0 ? internalMocker : null;
}
function printObject(object) {
    if (object === null) {
        return "null";
    }
    if (object === undefined) {
        return "undefined";
    }
    if (object instanceof RegExp) {
        return object.toString();
    }
    const mockerData = GetMockerDataSafe(object);
    if (mockerData !== null) {
        return mockerData.mockName;
    }
    return JSON.stringify(object);
}
exports.printObject = printObject;
//# sourceMappingURL=Stringify.js.map