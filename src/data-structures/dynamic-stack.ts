type MutationResult<T> = [success: boolean, stack: IDynamicStack<T> | null];
type MutationRetrievalResult<T> = [value: T | null, stack: IDynamicStack<T> | null];

export interface IDynamicStack<T> {
    items: T[];

    push(value: T): MutationResult<T>;
    peek(): T | null;
    pop(): MutationRetrievalResult<T>;
    isEmpty(): boolean;
    size(): number;
}

export function DynamicStack<T = number>(...initValues: T[]): IDynamicStack<T> {
    const items = [ ...initValues ];

    // prevent direct modification of underlying array
    Object.freeze(items);
    Object.seal(items);

    const push = (value: T): MutationResult<T> => {
        const newStack = DynamicStack(...[value].concat(items));
        return [true, newStack];
    };

    const peek = (): T | null => {
        return items[0] || null;
    };

    const pop = (): MutationRetrievalResult<T> => {
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
