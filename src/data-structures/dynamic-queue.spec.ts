import { DynamicQueue } from "./dynamic-queue";
import { QueueEmptyError } from "./errors";

describe('DynamicQueue', () => {

    it('should initialize as empty', () => {
        expect(DynamicQueue()).toBeDefined();
    });

    it('should initialize with values', () => {
        const initial = DynamicQueue(1, 2, 3);
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

        const initial = DynamicQueue();

        expect(Array.isArray(initial.items)).toBe(true);
        expect(Object.isFrozen(initial.items)).toBe(true);
        expect(Object.isSealed(initial.items)).toBe(true);

        for (const funcName of functions) {
            expect(initial).toHaveProperty(funcName);
            expect(typeof (initial as {[k: string]: any})[funcName]).toBe('function');
        }
    });

    describe('DynamicQueue::front()', () => {
        it('should throw a QueueEmptyError for a queue that is empty', () => {
            const initial = DynamicQueue();
            expect(() => initial.front()).toThrow(new QueueEmptyError());
        });

        it('should return the correct front value for a queue with existing values', () => {
            const initial = DynamicQueue(10, 20, 30);
            expect(initial.front()).toBe(30);
        });
    });

    describe('DynamicQueue::rear()', () => {
        it('should throw a QueueEmptyError for a queue that is empty', () => {
            const initial = DynamicQueue();
            expect(() => initial.rear()).toThrow(new QueueEmptyError());
        });

        it('should return the correct rear value for a queue with existing values', () => {
            const initial = DynamicQueue(10, 20, 30);
            expect(initial.rear()).toBe(10);
        });

        it('should update the queue and return the new value after enqueueing', () => {
            const initial = DynamicQueue(10, 20, 30);
            expect(initial.rear()).toBe(10);

            const [success, newQueue] = initial.enqueue(999);
            expect(success).toBe(true);
            expect(newQueue?.rear()).toBe(999);
        });
    });

    describe('DynamicQueue::enqueue(T)', () => {
        it('should add a new value to an empty queue', () => {
            const [success, newQueue] = DynamicQueue().enqueue(999);

            expect(success).toBe(true);
            expect(newQueue?.items).toStrictEqual([999]);
        });

        it('should add a queue in position 0 for a queue with existing values', () => {
            const [success, newQueue] = DynamicQueue(10, 20, 30).enqueue(999);

            expect(success).toBe(true);
            expect(newQueue?.items).toStrictEqual([999, 10, 20, 30]);
        });
    });

    describe('DynamicQueue::dequeue(T)', () => {
        it('should throw a QueueEmptyError when the queue is empty', () => {
            const initial = DynamicQueue();
            expect(() => initial.dequeue()).toThrow(new QueueEmptyError());
        })

        it('should remove a new value from the front of the queue and return an updated queue', () => {
            const [value, newQueue] = DynamicQueue(10, 20, 30, 999).dequeue();

            expect(value).toBe(999);
            expect(newQueue?.items).toStrictEqual([10, 20, 30]);
        });
    });

    describe('DynamicQueue::isEmpty()', () => {
        it('should return true for a queue that is initialized with no existing values', () => {
            const initial = DynamicQueue();

            expect(initial.isEmpty()).toBe(true);
        });

        it('should return false for a queue that is initialized with existing values', () => {
            const initial = DynamicQueue(10, 20, 30);

            expect(initial.isEmpty()).toBe(false);
        });

        it('should return true for a queue that is initialized with 1 existing value that is dequeued', () => {
            const [value, newQueue] = DynamicQueue(10).dequeue();

            expect(value).toBe(10);
            expect(newQueue?.isEmpty()).toBe(true);
        });
    });

    describe('DynamicQueue::size()', () => {
        it('should return a size of 0 for a queue that is initialized with no existing values', () => {
            const initial = DynamicQueue();

            expect(initial.size()).toBe(0);
        });

        it('should return a size of 0 for a queue that is initialized with existing values', () => {
            const initial = DynamicQueue(10, 20, 30);

            expect(initial.size()).toBe(3);
        });
    })
});
