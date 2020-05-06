interface BaseMockerData {
    mockName: string;
}

const INTERNAL_MOCKER_NAME = "__internalMocker";
function GetMockerDataSafe(mock: any): BaseMockerData | null {
    const internalMocker: BaseMockerData = (mock as any)[INTERNAL_MOCKER_NAME];
    return internalMocker ?? null;
}

function printObject(object: any): string {
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

export {
    printObject,
    INTERNAL_MOCKER_NAME
}