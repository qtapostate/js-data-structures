type DynamicStackMutationResult<T> = [success: boolean, stack: IDynamicStack<T> | null];
type DynamicStackMutationRetrievalResult<T> = [value: T | null, stack: IDynamicStack<T> | null];

export interface IDynamicStack<T> {
    items: T[];

    push(value: T): DynamicStackMutationResult<T>;
    peek(): T | null;
    pop(): DynamicStackMutationRetrievalResult<T>;
    isEmpty(): boolean;
    size(): number;
}

export interface IFixedStack<T> extends IDynamicStack<T> {
    maxSize: number | undefined;

    isFull(): boolean;
    hasMaxSize(): boolean;
    max(): number | undefined;
}

export function DynamicStack<T = number>(...initValues: T[]): IDynamicStack<T> {
    const items = [ ...initValues ];

    // prevent direct modification of underlying array
    Object.freeze(items);
    Object.seal(items);

    const push = (value: T): DynamicStackMutationResult<T> => {
        const newStack = DynamicStack(...[value].concat(items));
        return [true, newStack];
    };

    const peek = (): T | null => {
        return items[0] || null;
    };

    const pop = (): DynamicStackMutationRetrievalResult<T> => {
        const returnValue = items[0] || null;
        const newStack = DynamicStack(...items.slice(1));

        return [returnValue, returnValue !== null ? newStack : null];
    };

    const isEmpty = (): boolean => {
        return size() === 0;
    };

    const size = (): number => {
        return items.length;
    }

    return {
        items,
        push,
        peek,
        pop,
        isEmpty,
        size
    }
}

