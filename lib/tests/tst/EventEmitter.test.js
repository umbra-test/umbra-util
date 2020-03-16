"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const SimpleEventEmitter_1 = require("../src/SimpleEventEmitter");
chai.use(chaiAsPromised);
chai.use(sinonChai);
const expect = chai.expect;
describe("SimpleEventEmitter", () => {
    let eventEmitter;
    beforeEach(() => {
        eventEmitter = new SimpleEventEmitter_1.SimpleEventEmitter();
    });
    describe("emit", () => {
        it("should do nothing if there's no attached listeners", () => {
            eventEmitter.emit("oneArg", "random-test-name");
        });
    });
    describe("on", () => {
        it("should call those callbacks listening for a one-arg event", () => {
            const spy = sinon.spy();
            eventEmitter.on("oneArg", spy);
            const expectedString = "blargh";
            eventEmitter.emit("oneArg", expectedString);
            expect(spy).to.have.been.calledWith(expectedString);
            expect(spy).to.have.been.calledOnce;
        });
        it("should call those callbacks listening for a multi-arg event", () => {
            const spy = sinon.spy();
            eventEmitter.on("twoArg", spy);
            const expectedNumber = 1234;
            const expectedString = "blargh";
            eventEmitter.emit("twoArg", expectedNumber, expectedString);
            expect(spy).to.have.been.calledWith(expectedNumber, expectedString);
            expect(spy).to.have.been.calledOnce;
        });
        it("should call those callbacks listening for a one-arg event, once per emit", () => {
            const spy = sinon.spy();
            eventEmitter.on("oneArg", spy);
            const expectedString = "blargh";
            eventEmitter.emit("oneArg", expectedString);
            const secondString = "blargatha";
            eventEmitter.emit("oneArg", secondString);
            expect(spy).to.have.been.calledWith(expectedString);
            expect(spy).to.have.been.calledWith(secondString);
            expect(spy).to.have.been.calledTwice;
        });
        it("shouldn't call the same callback multiple times, if it's attached multiple times", () => {
            const spy = sinon.spy();
            eventEmitter.on("oneArg", spy);
            eventEmitter.on("oneArg", spy);
            eventEmitter.on("oneArg", spy);
            const expectedString = "blargh";
            eventEmitter.emit("oneArg", expectedString);
            expect(spy).to.have.been.calledWith(expectedString);
            expect(spy).to.have.been.calledOnce;
        });
    });
    describe("once", () => {
        it("should call those callbacks listening for a one-arg event", () => {
            const spy = sinon.spy();
            eventEmitter.once("oneArg", spy);
            const expectedString = "blargh";
            eventEmitter.emit("oneArg", expectedString);
            expect(spy).to.have.been.calledWith(expectedString);
            expect(spy).to.have.been.calledOnce;
        });
        it("should call those callbacks listening for a one-arg event, but only once regardless of the args", () => {
            const spy = sinon.spy();
            eventEmitter.once("oneArg", spy);
            const expectedString = "blargh";
            eventEmitter.emit("oneArg", expectedString);
            const secondString = "blargatha";
            eventEmitter.emit("oneArg", secondString);
            expect(spy).to.have.been.calledWith(expectedString);
            expect(spy).to.have.been.calledOnce;
        });
        it("shouldn't call the same callback multiple times, even if it's multiple times", () => {
            const spy = sinon.spy();
            eventEmitter.once("oneArg", spy);
            const expectedString = "blargh";
            eventEmitter.emit("oneArg", expectedString);
            eventEmitter.emit("oneArg", expectedString);
            eventEmitter.emit("oneArg", expectedString);
            eventEmitter.emit("oneArg", expectedString);
            expect(spy).to.have.been.calledWith(expectedString);
            expect(spy).to.have.been.calledOnce;
        });
    });
    describe("off", () => {
        it("should remove any attached callbacks of on", () => {
            const spy = sinon.spy();
            eventEmitter.on("oneArg", spy);
            eventEmitter.off("oneArg", spy);
            eventEmitter.emit("oneArg", "blargh");
            expect(spy).to.not.have.been.called;
        });
        it("should remove any attached callbacks of once", () => {
            const spy = sinon.spy();
            eventEmitter.once("oneArg", spy);
            eventEmitter.off("oneArg", spy);
            eventEmitter.emit("oneArg", "blargh");
            expect(spy).to.not.have.been.called;
        });
        it("should do nothing if none are attached", () => {
            eventEmitter.off("oneArg", () => null);
        });
    });
    describe("emitAndWaitForCompletion", () => {
        it("should still emit synchronously", () => {
            const spy = sinon.spy();
            eventEmitter.on("oneArg", spy);
            const expectedString = "blargh";
            eventEmitter.emitAndWaitForCompletion("oneArg", expectedString);
            expect(spy).to.have.been.calledWith(expectedString);
            expect(spy).to.have.been.calledOnce;
        });
        it("should do nothing if there are no event handlers", () => {
            const promise = eventEmitter.emitAndWaitForCompletion("oneArg", "blargh");
            return expect(promise).to.eventually.be.undefined;
        });
        it("should return a promise that is resolved for synchronous execution", () => {
            const spy = sinon.spy();
            eventEmitter.on("oneArg", spy);
            const promise = eventEmitter.emitAndWaitForCompletion("oneArg", "blargh");
            return expect(promise).to.eventually.be.undefined;
        });
        it("should return a promise that is resolved when any async event handlers complete", () => {
            const spy = sinon.spy(() => Promise.resolve());
            eventEmitter.on("oneArg", spy);
            const promise = eventEmitter.emitAndWaitForCompletion("oneArg", "blargh");
            return expect(promise).to.eventually.be.undefined;
        });
        it("should return a promise that is rejected when any async event handlers reject", () => {
            const error = new Error("random-error");
            const spy = sinon.spy(() => Promise.reject(error));
            eventEmitter.on("oneArg", spy);
            const promise = eventEmitter.emitAndWaitForCompletion("oneArg", "blargh");
            return expect(promise).to.eventually.be.rejectedWith(error);
        });
        it("should return a promise that is rejected when any async event handlers reject for once", () => {
            const error = new Error("random-error");
            const spy = sinon.spy(() => Promise.reject(error));
            eventEmitter.once("oneArg", spy);
            const promise = eventEmitter.emitAndWaitForCompletion("oneArg", "blargh");
            return expect(promise).to.eventually.be.rejectedWith(error);
        });
        it("should return a promise that is rejected if event handlers throw an error", () => {
            const error = new Error("random-error");
            const spy = sinon.stub().throws(error);
            eventEmitter.on("oneArg", spy);
            const promise = eventEmitter.emitAndWaitForCompletion("oneArg", "blargh");
            return expect(promise).to.eventually.be.rejectedWith(error);
        });
        it('should return a promise that is rejected if event handlers throw for once', () => {
            const error = new Error("random-error");
            const spy = sinon.stub().throws(error);
            eventEmitter.once("oneArg", spy);
            const promise = eventEmitter.emitAndWaitForCompletion("oneArg", "blargh");
            return expect(promise).to.eventually.be.rejectedWith(error);
        });
    });
});
describe("SimpleEventEmitter Utilities", () => {
    describe("union", () => {
        it("should return an arrayB if the first array does not exist", () => {
            const arrayB = ["thing"];
            for (const value of [undefined, null]) {
                expect(SimpleEventEmitter_1.union(value, arrayB)).to.deep.equal(arrayB);
            }
        });
        it("should return arrayA if arrayB doesn't exist", () => {
            const arrayA = ["thing"];
            for (const value of [undefined, null]) {
                expect(SimpleEventEmitter_1.union(arrayA, value)).to.deep.equal(arrayA);
            }
        });
        it("should return an empty array if both arrayA and arrayB don't exist", () => {
            for (const value of [undefined, null]) {
                expect(SimpleEventEmitter_1.union(value, value)).to.deep.equal([]);
            }
        });
        it("should union arrays of different values", () => {
            const arrayA = ["a", "b", "c"];
            const arrayB = ["d", "e", "f"];
            expect(SimpleEventEmitter_1.union(arrayA, arrayB)).to.deep.equal(["a", "b", "c", "d", "e", "f"]);
        });
        it("should not copy elements of equal value", () => {
            const arrayA = ["a", "b", "c"];
            const arrayB = ["a", "b", "c", "d", "e", "f"];
            expect(SimpleEventEmitter_1.union(arrayA, arrayB)).to.deep.equal(["a", "b", "c", "d", "e", "f"]);
        });
        it("should not recursively go below the top level", () => {
            const arrayA = [{
                    a: "a",
                    b: "b"
                }];
            const arrayB = [{
                    a: "a",
                    b: "b",
                    c: "c"
                }];
            expect(SimpleEventEmitter_1.union(arrayA, arrayB)).to.deep.equal([{
                    a: "a",
                    b: "b"
                }, {
                    a: "a",
                    b: "b",
                    c: "c"
                }]);
        });
    });
    describe("without", () => {
        it("should return an empty array if the array does not exist", () => {
            for (const value of [undefined, null]) {
                expect(SimpleEventEmitter_1.without(value, "a")).to.deep.equal([]);
            }
        });
        it("should return the array unchanged if the expected value doesn't exist", () => {
            const array = ["a", "b", "c"];
            expect(SimpleEventEmitter_1.without(array, "d")).to.deep.equal(array);
        });
        it("should remove elements from the array that exist", () => {
            const array = ["a", "b", "c"];
            expect(SimpleEventEmitter_1.without(array, "b")).to.deep.equal(["a", "c"]);
        });
        it("should NOT REMOVE DUPLICATE VALUES -- this is an important caveat of this implementation", () => {
            const array = ["a", "b", "b", "b", "c"];
            expect(SimpleEventEmitter_1.without(array, "b")).to.deep.equal(["a", "b", "b", "c"]);
        });
    });
});
//# sourceMappingURL=EventEmitter.test.js.map