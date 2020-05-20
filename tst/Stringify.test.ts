import { printObject } from "../src";
import { assert } from "umbra-test";

describe("stringify", () => {

    it("should handle stringifying an object", () => {
        const fooObject ={
            foo: "bar 'bar'"
        };
        const testObject: any = {
            foo: "bar \"bar\"",
            foo2: [
                "foo",
                "bar",
                fooObject
            ],
            "foo-foo": "bar",
            "2foo": "bar",
            "@#": "bar",
            $el: "bar",
            _private: "bar",
            number: 1,
            boolean: true,
            date: new Date("1955-11-05T01:21:00.000Z"),
            escapedString: "\"\"",
            null: null,
            undefined: undefined,
            fn: function fn() {},
            regex: /./,
            NaN: NaN,
            Infinity: Infinity,
            newlines: "foo\nbar\r\nbaz",
            [Symbol()]: Symbol(),
            [Symbol("foo")]: Symbol("foo"),
            [Symbol.for("foo")]: Symbol("foo"),
            array: [
                1,
                2,
                {
                    foo: "bar"
                },
                fooObject
            ]
        };

        testObject.circular = testObject;
        
        const stringObject = printObject(testObject);
        assert.equal(stringObject,
`{
  "foo": "bar \\"bar\\"",
  "foo2": [
    "foo",
    "bar",
    {
      "foo": "bar \\'bar\\'"
    }
  ],
  "foo-foo": "bar",
  "2foo": "bar",
  "@#": "bar",
  "$el": "bar",
  "_private": "bar",
  "number": 1,
  "boolean": true,
  "date": new Date("1955-11-05T01:21:00.000Z"),
  "escapedString": "\\"\\"",
  "null": null,
  "undefined": undefined,
  "fn": function fn() { },
  "regex": /./,
  "NaN": NaN,
  "Infinity": Infinity,
  "newlines": "foo\\nbar\\r\\nbaz",
  "array": [
    1,
    2,
    {
      "foo": "bar"
    },
    {
      "foo": "bar \\'bar\\'"
    }
  ],
  "circular": [[Circular Object Reference]],
  Symbol(): Symbol(),
  Symbol(foo): Symbol(foo),
  Symbol(foo): Symbol(foo)
}`);
    });

});