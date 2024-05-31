import { DynamicStack } from "./stack"

describe('DynamicStack', () => {
    it ('should initialize', () => {
        expect(DynamicStack()).toBeDefined();
    });

    it ('should have the required properties', () => {
        let initial = DynamicStack();

        expect(Array.isArray(initial.items)).toBe(true);
        expect(Object.isFrozen(initial.items)).toBe(true);
        expect(Object.isSealed(initial.items)).toBe(true);

        for (const funcName of ["isEmpty", "push", "peek", "pop", "size"]) {
            expect(initial).toHaveProperty(funcName);
            expect(typeof (initial as { [k: string]: any })[funcName]).toBe('function');
        }
    });

    describe('DynamicStack::push(T)', () => {
        it('should push a value onto an empty stack and contain the new value', () => {
            let initial = DynamicStack();

            expect(initial.size()).toBe(0);

            const [success, newStack] = initial.push(10);
            expect(success).toBe(true);
            expect(newStack?.items).toStrictEqual([10]);
        });

        it('should push a value onto a stack with existing values, place the new value in position 0, and move all other items up one position', () => {
            let initial = DynamicStack(10, 20, 30);

            expect(initial.size()).toBe(3);

            const [success, newStack] = initial.push(5);
            expect(success).toBe(true);
            expect(newStack?.size()).toBe(4);
            expect(newStack?.items).toStrictEqual([5, 10, 20, 30]);
        });
    });

    describe('DynamicStack::peek()', () => {
        it('should return null if the stack is empty', () => {
            let initial = DynamicStack();

            expect(initial.size()).toBe(0);
            expect(initial.peek()).toBe(null);
        });

        it('should return the correct value in position 0 if there are values in the stack', () => {
            let initial = DynamicStack(10, 20, 30);

            expect(initial.size()).toBe(3);
            expect(initial.peek()).toBe(10);
        });

        it('should return the correct value in position 0 after pushing a new value onto a stack with existing values', () => {
            let initial = DynamicStack(10, 20, 30);

            expect(initial.size()).toBe(3);
            expect(initial.peek()).toBe(10);

            const [success, newStack] = initial.push(5);
            expect(success).toBe(true);
            expect(newStack?.peek()).toBe(5);
        });
    });

    describe('DynamicStack::pop()', () => {
        it('should safely but non-successfully return when attempting to pop a value from an empty stack', () => {
            let initial = DynamicStack();

            expect(initial.size()).toBe(0);
            
            const result = initial.pop();
            expect(result).toStrictEqual([null, null]);
        });

        it('should return the correct value in position 0 after popping a value from a stack with existing values', () => {
            let initial = DynamicStack(10, 20, 30);

            expect(initial.size()).toBe(3);

            const [value, newStack] = initial.pop();
            expect(value).toBe(10);
            expect(newStack?.items).toStrictEqual([20, 30]);
        })

        it('should return the correct value in position 0 after popping a value from a stack with existing values and newly pushed values', () => {
            let initial = DynamicStack(10, 20, 30);

            expect(initial.size()).toBe(3);
            expect(initial.items).toStrictEqual([10, 20, 30]);

            const [firstPopValue, newStack1] = initial.pop();
            expect(firstPopValue).toBe(10);
            expect(newStack1?.items).toStrictEqual([20, 30]);

            const [pushSuccess, newStack2] = newStack1!.push(999);
            expect(pushSuccess).toBe(true);
            expect(newStack2?.items).toStrictEqual([999, 20, 30]);

            const [secondPopValue, newStack3] = newStack2!.pop();
            expect(secondPopValue).toBe(999);
            expect(newStack3?.items).toStrictEqual([20, 30]);
        })
    });
})