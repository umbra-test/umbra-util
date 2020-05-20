interface BaseMockerData {
    mockName: string;
}

const INTERNAL_MOCKER_NAME = "__internalMocker";
function GetMockerDataSafe(mock: any): BaseMockerData | null {
    const internalMocker: BaseMockerData = (mock as any)[INTERNAL_MOCKER_NAME];
    return internalMocker ?? null;
}

const defaultIndent = "  ";
function printString(object: string | number | symbol): string {
    if (typeof object === "symbol" || typeof object === "number") {
        return String(object);
    }

    return `"${String(object).replace(/"/g, "\\\"").replace(/\\?'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n")}"`;
}
function printObject(object: any): string {
    const alreadySeenObjects: any[] = [];
    const printObjectCapture = (objectCaptured: any, indent: string = defaultIndent): string => {
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
            const arrayData: string[] = [];
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
            const keyStrings: string[] = [];
            for (const key of keys) {
                keyStrings.push(`${indent}${printString(key)}: ${printObjectCapture(Reflect.get(objectCaptured, key), indent + defaultIndent)}`);
            }

            alreadySeenObjects.pop();

            return `{\n${keyStrings.join(",\n")}\n${indent.substr(defaultIndent.length)}}`;
        }

        return printString(objectCaptured);
    }

    return printObjectCapture(object);
}

export {
    printObject,
    INTERNAL_MOCKER_NAME
}