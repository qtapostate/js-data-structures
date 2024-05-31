import { DynamicStack, IStack, StackUnderflowError } from "./dynamic-stack";

type MutationResult<T> = [success: boolean, stack: IFixedStack<T> | null];
type MutationRetrievalResult<T> = [value: T | null, stack: IFixedStack<T> | null];

export class StackOverflowError extends TypeError {
    constructor() {
        super("StackOverflowError: Stack has reached maximum capacity.");
    }
}

export interface IFixedStack<T> extends IStack<T> {
    isFull(): boolean;
    capacity(): number;
}

export function FixedStack<T = number>(maxSize: number, ...initValues: T[]): IFixedStack<T> {
    if (initValues.length > Math.floor(maxSize)) {
        throw new StackOverflowError();
    }

    if (maxSize < 0) {
        throw new RangeError("RangeError: max size must be a positive integer.")
    }
    
    // get base functions so we don't have to reimplement them all
    const {
        items,
        peek,
        isEmpty,
        size
    } = DynamicStack(...initValues);

    const capacity = () => Math.floor(maxSize);

    const isFull = () => items.length >= capacity();

    const push = (value: T): MutationResult<T> => {
        if (size() + 1 > capacity()) {
            throw new StackOverflowError();
        }

        const newStack = FixedStack(maxSize, ...[value].concat(items));
        return [true, newStack];
    };

    const pop = (): MutationRetrievalResult<T> => {
        if (items.length === 0) {
            throw new StackUnderflowError();
        }

        const returnValue = items[0];
        const newStack = FixedStack(maxSize, ...items.slice(1));

        return [returnValue, newStack];
    };

    return {
        items,
        peek,
        isEmpty,
        size,
        push,
        pop,
        capacity,
        isFull,
    }
}
