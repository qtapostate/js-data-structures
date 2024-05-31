type MutationResult<T> = [success: boolean, stack: IStack<T> | null];
type MutationRetrievalResult<T> = [value: T | null, stack: IStack<T> | null];

export class StackUnderflowError extends TypeError {
    constructor() {
        super("StackUnderflowError: Stack has no remaining items to pop.");
    }
}

export interface IStack<T> {
    items: T[];

    push(value: T): MutationResult<T>;
    peek(): T | null;
    pop(): MutationRetrievalResult<T>;
    isEmpty(): boolean;
    size(): number;
}

export function DynamicStack<T = number>(...initValues: T[]): IStack<T> {
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
        if (items.length === 0) {
            throw new StackUnderflowError();
        }

        const returnValue = items[0];
        const newStack = DynamicStack(...items.slice(1));

        return [returnValue, newStack];
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
