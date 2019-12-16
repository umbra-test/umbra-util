import { deepEqual } from "./DeepEqual";

function any<T>(): T {
    const validator: ArgumentValidator<T> = {
        // Any has very lower precedence, so other matchers will match first
        precedence: -1,
        matches: () => true,
        description: () => "any()",
    };
    return validator as any as T;
}

function gt<T extends number>(value: T): T {
    const validator: ArgumentValidator<T> = {
        matches: ((realValue: T) => realValue > value),
        description: () => `gt(${JSON.stringify(value)})`,
    };
    return validator as any as T;
}

function lt<T extends number>(value: T): T {
    const validator: ArgumentValidator<T> = {
        matches: ((realValue: T) => realValue < value),
        description: () => `lt(${JSON.stringify(value)})`,
    };
    return validator as any as T;
}

function gte<T extends number>(value: T): T {
    const validator: ArgumentValidator<T> = {
        matches: ((realValue: T) => realValue >= value),
        description: () => `gte(${JSON.stringify(value)})`,
    };
    return validator as any as T;
}

function lte<T extends number>(value: T): T {
    const validator: ArgumentValidator<T> = {
        matches: ((realValue: T) => realValue <= value),
        description: () => `lte(${JSON.stringify(value)})`,
    };
    return validator as any as T;
}

function eq<T>(value: T): T {
    const validator: ArgumentValidator<T> = {
        precedence: 1,
        matches: ((realValue: T) => deepEqual(value, realValue)),
        description: () => JSON.stringify(value),
    };
    return validator as any as T;
}

function startsWith(value: string) {
    const validator: ArgumentValidator<string> = {
        matches: ((realValue: string) => realValue.startsWith(value)),
        description: () => "startsWith " + value,
    };
    return validator as any as string;
}

function regexMatches(value: RegExp) {
    const validator: ArgumentValidator<string> = {
        matches: ((realValue: string) => value.test(realValue)),
        description: () => value.toString(),
    };
    return validator as any as string;
}

function matcher<T>(func: (arg: T) => boolean): T {
    return {
        matches: (realValue: T) => func(realValue),
        description: () => func.toString(),
    } as any;
}

interface ArgumentValidator<T> {

    /**
     * Represents the importance of validator compared to other matchers. Higher number means more important, and thus
     * more likely to be matches
     */
    precedence?: number;

    matches(arg: T): boolean;

    description?(): string;
}

export {
    any,
    eq,
    gt,
    gte,
    lt,
    lte,
    startsWith,
    regexMatches,
    matcher,
    ArgumentValidator,
};