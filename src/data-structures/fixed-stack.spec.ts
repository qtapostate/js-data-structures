import { FixedStack, StackOverflowError, StackUnderflowError } from "."

describe('FixedStack', () => {
    it ('should initialize', () => {
        expect(FixedStack(0)).toBeDefined();
    });

    it ('should have the required properties', () => {
        let initial = FixedStack(0);

        expect(Array.isArray(initial.items)).toBe(true);
        expect(Object.isFrozen(initial.items)).toBe(true);
        expect(Object.isSealed(initial.items)).toBe(true);

        for (const funcName of ["isEmpty", "push", "peek", "pop", "size"]) {
            expect(initial).toHaveProperty(funcName);
            expect(typeof (initial as { [k: string]: any })[funcName]).toBe('function');
        }
    });

    it('should throw a StackOverflowError when specifying more values than the capacity at init', () => {
        expect(() => FixedStack(1, 20, 50)).toThrow(new StackOverflowError());
    })

    describe('FixedStack::push(T)', () => {
        it('should push a value onto an empty stack and contain the new value', () => {
            let initial = FixedStack(1);

            expect(initial.size()).toBe(0);

            const [success, newStack] = initial.push(10);
            expect(success).toBe(true);
            expect(newStack?.items).toStrictEqual([10]);
        });

        it('should push a value onto a stack with existing values, place the new value in position 0, and move all other items up one position', () => {
            let initial = FixedStack(3, 10, 20);

            expect(initial.size()).toBe(2);

            const [success, newStack] = initial.push(5);
            expect(success).toBe(true);
            expect(newStack?.size()).toBe(3);
            expect(newStack?.items).toStrictEqual([5, 10, 20]);
        });

        it('should throw a StackOverflowError when pushing a value when capacity has been reached', () => {
            let initial = FixedStack(3, 10, 20, 40);

            expect(initial.size()).toBe(3);

            expect(() => initial.push(5)).toThrow(new StackOverflowError());
        });
    });

    describe('FixedStack::peek()', () => {
        it('should return null if the stack is empty', () => {
            let initial = FixedStack(0);

            expect(initial.size()).toBe(0);
            expect(initial.peek()).toBe(null);
        });

        it('should return the correct value in position 0 if there are values in the stack', () => {
            let initial = FixedStack(3, 10, 20, 30);

            expect(initial.size()).toBe(3);
            expect(initial.peek()).toBe(10);
        });

        it('should return the correct value in position 0 after pushing a new value onto a stack with existing values', () => {
            let initial = FixedStack(3, 10, 20);

            expect(initial.size()).toBe(2);
            expect(initial.peek()).toBe(10);

            const [success, newStack] = initial.push(5);
            expect(success).toBe(true);
            expect(newStack?.peek()).toBe(5);
        });
    });

    describe('FixedStack::pop()', () => {
        it('should throw a StackUnderflowError when attempting to pop from a stack with no values', () => {
            let initial = FixedStack(0);

            expect(initial.size()).toBe(0);
            
            expect(() => initial.pop()).toThrow(new StackUnderflowError());
        });

        it('should return the correct value in position 0 after popping a value from a stack with existing values', () => {
            let initial = FixedStack(3, 10, 20, 30);

            expect(initial.size()).toBe(3);

            const [value, newStack] = initial.pop();
            expect(value).toBe(10);
            expect(newStack?.items).toStrictEqual([20, 30]);
        })

        it('should return the correct value in position 0 after popping a value from a stack with existing values and newly pushed values', () => {
            let initial = FixedStack(3, 10, 20, 30);

            expect(initial.size()).toBe(3);
            expect(initial.items).toStrictEqual([10, 20, 30]);

            const [firstPopValue, newStack1] = initial.pop();
            expect(firstPopValue).toBe(10);
            expect(newStack1?.size()).toBe(2);
            expect(newStack1?.items).toStrictEqual([20, 30]);

            const [pushSuccess, newStack2] = newStack1!.push(999);
            expect(pushSuccess).toBe(true);
            expect(newStack2?.size()).toBe(3);
            expect(newStack2?.items).toStrictEqual([999, 20, 30]);

            const [secondPopValue, newStack3] = newStack2!.pop();
            expect(secondPopValue).toBe(999);
            expect(newStack3?.size()).toBe(2);
            expect(newStack3?.items).toStrictEqual([20, 30]);
        })
    });

    describe('FixedStack::isEmpty()', () => {
        it ('should return true for a stack that has only just been initialized', () => {
            let initial = FixedStack(0);

            expect(initial.isEmpty()).toBe(true);
        });

        it ('should return false for a stack with existing values', () => {
            let initial = FixedStack(3, 10, 20, 30);

            expect(initial.isEmpty()).toBe(false);
        });

        it ('should return true for a stack with existing values that has those values popped', () => {
            let [value, newStack] = FixedStack(1, 10).pop();

            expect(value).toBe(10);
            expect(newStack?.isEmpty()).toBe(true);
        });
    });
})