export class InvalidSizeError extends RangeError {
    constructor() {
        super("RangeError: max size must be a positive integer.");
    }
}

export class QueueEmptyError extends Error {
    constructor() {
        super("QueueEmptyError: Failed to dequeue element from empty queue.");
    }
}

export class StackUnderflowError extends TypeError {
    constructor() {
        super("StackUnderflowError: Stack has no remaining items to pop.");
    }
}

export class StackOverflowError extends TypeError {
    constructor() {
        super("StackOverflowError: Stack has reached maximum capacity.");
    }
}

export class QueueCapacityReachedError extends Error {
    constructor() {
        super("QueueCapacityReachedError: Unable to add new items to a queue when it has reached the defined capacity.");
    }
}