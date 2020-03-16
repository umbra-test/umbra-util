declare type CompareFunction<T> = (a?: T, b?: T) => number;
declare class SortedArray<T> {
    private readonly array;
    private readonly compareFunction;
    constructor(compare?: CompareFunction<T>, initialValues?: T[]);
    getData(): T[];
    insert(element: T): void;
    search(element: T): number;
    remove(element: T): void;
    private searchInternal;
}
export { CompareFunction, SortedArray };
