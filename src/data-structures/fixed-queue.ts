import { DynamicQueue, IQueue } from "./dynamic-queue";

type MutationResult<T> = [success: boolean, queue: IFixedQueue<T> | null];
type MutationRetrievalResult<T> = [value: T | null, queue: IFixedQueue<T> | null];

export class QueueCapacityReachedError extends Error {
    constructor() {
        super("QueueCapacityReachedError: Unable to add new items to a queue when it has reached the defined capacity.");
    }
}

export interface IFixedQueue<T> extends IQueue<T> {
    isFull(): boolean;
    capacity(): number;
}

export function FixedQueue<T = number>(maxSize: number, ...initValues: T[]): IFixedQueue<T> {
    if (initValues.length > Math.floor(maxSize)) {
        throw new QueueCapacityReachedError();
    }

    if (maxSize < 0) {
        throw new RangeError("RangeError: max size must be a positive integer.")
    }

    const {
        items,
        size,
        isEmpty,
        front,
        rear,
        dequeue
    } = DynamicQueue(...initValues);

    const capacity = () => Math.floor(maxSize);
    const isFull = () => size() >= capacity();

    const enqueue = (value: T): MutationResult<T> => {
        if (isFull()) {
            throw new QueueCapacityReachedError();
        }

        const newQueue = FixedQueue(maxSize, ...[value].concat(items));
        return [true, newQueue];
    }

    return {
        items,
        size,
        isEmpty,
        front,
        rear,
        dequeue,
        isFull,
        capacity,
        enqueue
    }
}