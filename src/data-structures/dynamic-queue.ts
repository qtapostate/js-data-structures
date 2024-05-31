type MutationResult<T> = [success: boolean, queue: IDynamicQueue<T> | null];
type MutationRetrievalResult<T> = [value: T | null, queue: IDynamicQueue<T> | null];

export class QueueEmptyError extends Error {
    constructor() {
        super("QueueEmptyError: Failed to dequeue element from empty queue.");
    }
}

export interface IDynamicQueue<T> {
    items: T[];

    front(): T | null;
    rear(): T | null;
    enqueue(value: T): MutationResult<T>;
    dequeue(): MutationRetrievalResult<T>;
    isEmpty(): boolean;
    size(): number;
}

export function DynamicQueue<T = number>(...initValues: T[]): IDynamicQueue<T> {
    const items = [ ...initValues ];

    // prevent direct modification of underlying array
    Object.freeze(items);
    Object.seal(items);

    const size = () => items.length;
    const isEmpty = () => size() === 0;

    const rear = () => {
        if (isEmpty()) {
            throw new QueueEmptyError();
        }

        return items[0];
    }

    const front = () => {
        if (isEmpty()) {
            throw new QueueEmptyError();
        }

        return items[size() - 1];
    }

    const enqueue = (value: T): MutationResult<T> => {
        const newQueue = DynamicQueue(...[value].concat(items));
        return [true, newQueue];
    }

    const dequeue = (): MutationRetrievalResult<T> => {
        if (isEmpty()) {
            throw new QueueEmptyError();
        }

        const newQueue = DynamicQueue(...items.slice(0, size() - 1));
        return [front(), newQueue];
    }

    return {
        items,
        size,
        isEmpty,
        front,
        rear,
        enqueue,
        dequeue
    };
}