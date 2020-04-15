/**
 * Simple array union with automatic creation if the arrays don't exist. This is a nice optimization which
 * enables the event emitter to lazy-instantiate event callback arrays.
 *
 * @param arrayA
 * @param arrayB
 * @return arrayA, modified to include all items from arrayB that weren't already in arrayA. If arrayA doesn't exist,
 *         an empty array is returned.
 */
function union<T>(arrayA: T[] | undefined, arrayB: T[] | undefined): T[] {
    if (!arrayA) {
        return arrayB ? arrayB : [];
    }

    if (!arrayB) {
        return arrayA;
    }

    for (const item of arrayB) {
        if (arrayA.indexOf(item) === -1) {
            arrayA.push(item);
        }
    }

    return arrayA;
}

/**
 * Simple array item removal with automatic creation if the array doesn't exist. This is a nice optimization which
 * enables the event emitter to lazy-instantiate event callback arrays.
 *
 * DOES NOT REMOVE DUPLICATE VALUES!
 *
 * @param array - The array from which to remove an item.
 * @param item - The item to remove from the given array.
 * @return The original array, modified to remove the item if it existed. If the array doesn't exist, an empty array
 *         is returned.
 */
function without<T>(array: T[] | undefined, item: T): T[] {
    if (!array) {
        return [];
    }

    const indexOfItem = array.indexOf(item);
    if (indexOfItem !== -1) {
        array.splice(indexOfItem, 1);
    }

    return array;
}

export {union, without};
