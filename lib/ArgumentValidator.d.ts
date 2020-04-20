declare function any<T>(): T;
declare function gt<T extends number>(value: T): T;
declare function lt<T extends number>(value: T): T;
declare function gte<T extends number>(value: T): T;
declare function lte<T extends number>(value: T): T;
declare function eq<T>(value: T): T;
declare function startsWith(value: string): string;
declare function regexMatches(value: RegExp): string;
declare function matcher<T>(func: (arg: T) => boolean): T;
interface ArgumentValidator<T> {
    precedence?: number;
    matches(arg: T): boolean;
    description(): string;
    equals(otherValidator: ArgumentValidator<any>): boolean;
}
export { any, eq, gt, gte, lt, lte, startsWith, regexMatches, matcher, ArgumentValidator, };
