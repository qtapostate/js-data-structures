import { QueueCapacityReachedError, QueueEmptyError } from "./errors";
import { FixedQueue } from "./fixed-queue";

describe('Fixed', () => {

    it('should initialize as empty', () => {
        expect(FixedQueue(0)).toBeDefined();
    });

    it('should initialize with values', () => {
        const initial = FixedQueue(3, 1, 2, 3);
        expect(initial).toBeDefined();
        expect(initial.items).toStrictEqual([1, 2, 3]);
    });

    it('should have all required functions', () => {
        const functions = [
            "size",
            "isEmpty",
            "front",
            "rear",
            "enqueue",
            "dequeue"
        ];

        const initial = FixedQueue(0);

        expect(Array.isArray(initial.items)).toBe(true);
        expect(Object.isFrozen(initial.items)).toBe(true);
        expect(Object.isSealed(initial.items)).toBe(true);

        for (const funcName of functions) {
            expect(initial).toHaveProperty(funcName);
            expect(typeof (initial as {[k: string]: any})[funcName]).toBe('function');
        }
    });

    it('should throw an error when initializing with more values than the specified capacity', () => {
        expect(() => FixedQueue(3, 10, 20, 30, 40, 50, 60, 70, 80)).toThrow(new QueueCapacityReachedError());
    })

    describe('FixedQueue::front()', () => {
        it('should throw a QueueEmptyError for a queue that is empty', () => {
            const initial = FixedQueue(0);
            expect(() => initial.front()).toThrow(new QueueEmptyError());
        });

        it('should return the correct front value for a queue with existing values', () => {
            const initial = FixedQueue(3, 10, 20, 30);
            expect(initial.front()).toBe(30);
        });
    });

    describe('FixedQueue::rear()', () => {
        it('should throw a QueueEmptyError for a queue that is empty', () => {
            const initial = FixedQueue(0);
            expect(() => initial.rear()).toThrow(new QueueEmptyError());
        });

        it('should return the correct rear value for a queue with existing values', () => {
            const initial = FixedQueue(3, 10, 20, 30);
            expect(initial.rear()).toBe(10);
        });

        it('should update the queue and return the new value after enqueueing', () => {
            const initial = FixedQueue(4, 10, 20, 30);
            expect(initial.rear()).toBe(10);

            const [success, newQueue] = initial.enqueue(999);
            expect(success).toBe(true);
            expect(newQueue?.rear()).toBe(999);
        });
    });

    describe('FixedQueue::enqueue(T)', () => {
        it('should add a new value to an empty queue', () => {
            const [success, newQueue] = FixedQueue(1).enqueue(999);

            expect(success).toBe(true);
            expect(newQueue?.items).toStrictEqual([999]);
        });

        it('should add an item in position 0 for a queue with existing values', () => {
            const [success, newQueue] = FixedQueue(4, 10, 20, 30).enqueue(999);

            expect(success).toBe(true);
            expect(newQueue?.items).toStrictEqual([999, 10, 20, 30]);
        });

        it('should throw an error when enqueuing a value on a queue that is full', () => {
            const initial = FixedQueue(0);

            expect(() => initial.enqueue(999)).toThrow(new QueueCapacityReachedError());
        });
    });

    describe('FixedQueue::dequeue(T)', () => {
        it('should throw a QueueEmptyError when the queue is empty', () => {
            const initial = FixedQueue(0);
            expect(() => initial.dequeue()).toThrow(new QueueEmptyError());
        })

        it('should remove a new value from the front of the queue and return an updated queue', () => {
            const [value, newQueue] = FixedQueue(4, 10, 20, 30, 999).dequeue();

            expect(value).toBe(999);
            expect(newQueue?.items).toStrictEqual([10, 20, 30]);
        });
    });

    describe('FixedQueue::isEmpty()', () => {
        it('should return true for a queue that is initialized with no existing values', () => {
            const initial = FixedQueue(0);

            expect(initial.isEmpty()).toBe(true);
        });

        it('should return false for a queue that is initialized with existing values', () => {
            const initial = FixedQueue(3, 10, 20, 30);

            expect(initial.isEmpty()).toBe(false);
        });

        it('should return true for a queue that is initialized with 1 existing value that is dequeued', () => {
            const [value, newQueue] = FixedQueue(1, 10).dequeue();

            expect(value).toBe(10);
            expect(newQueue?.isEmpty()).toBe(true);
        });
    });

    describe('FixedQueue::size()', () => {
        it('should return a size of 0 for a queue that is initialized with no existing values', () => {
            const initial = FixedQueue(0);

            expect(initial.size()).toBe(0);
        });

        it('should return a size of 0 for a queue that is initialized with existing values', () => {
            const initial = FixedQueue(3, 10, 20, 30);

            expect(initial.size()).toBe(3);
        });
    })
});
