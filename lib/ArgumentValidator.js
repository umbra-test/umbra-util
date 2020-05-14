"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matcher = exports.regexMatches = exports.startsWith = exports.lte = exports.lt = exports.gte = exports.gt = exports.eq = exports.any = void 0;
const DeepEqual_1 = require("./DeepEqual");
const Stringify_1 = require("./Stringify");
function any() {
    const validator = {
        precedence: -1,
        matches: () => true,
        description: () => "any()",
        equals: (other) => other.description() === validator.description()
    };
    return validator;
}
exports.any = any;
function gt(value) {
    const validator = {
        matches: ((realValue) => realValue > value),
        description: () => `gt(${Stringify_1.printObject(value)})`,
        equals: (other) => other.description() === validator.description()
    };
    return validator;
}
exports.gt = gt;
function lt(value) {
    const validator = {
        matches: ((realValue) => realValue < value),
        description: () => `lt(${Stringify_1.printObject(value)})`,
        equals: (other) => other.description() === validator.description()
    };
    return validator;
}
exports.lt = lt;
function gte(value) {
    const validator = {
        matches: ((realValue) => realValue >= value),
        description: () => `gte(${Stringify_1.printObject(value)})`,
        equals: (other) => other.description() === validator.description()
    };
    return validator;
}
exports.gte = gte;
function lte(value) {
    const validator = {
        matches: ((realValue) => realValue <= value),
        description: () => `lte(${Stringify_1.printObject(value)})`,
        equals: (other) => other.description() === validator.description()
    };
    return validator;
}
exports.lte = lte;
function eq(value) {
    const validator = {
        precedence: 1,
        matches: ((realValue) => DeepEqual_1.deepEqual(value, realValue)),
        description: () => Stringify_1.printObject(value),
        equals: (other) => other.description() === validator.description()
    };
    return validator;
}
exports.eq = eq;
function startsWith(value) {
    const validator = {
        matches: ((realValue) => realValue.startsWith(value)),
        description: () => "startsWith " + value,
        equals: (other) => other.description() === validator.description()
    };
    return validator;
}
exports.startsWith = startsWith;
function regexMatches(value) {
    const validator = {
        matches: ((realValue) => value.test(realValue)),
        description: () => value.toString(),
        equals: (other) => other.description() === validator.description()
    };
    return validator;
}
exports.regexMatches = regexMatches;
function matcher(func) {
    const validator = {
        matches: (realValue) => func(realValue),
        description: () => func.toString(),
        equals: (other) => other.description() === validator.description()
    };
    return validator;
}
exports.matcher = matcher;
//# sourceMappingURL=ArgumentValidator.js.map