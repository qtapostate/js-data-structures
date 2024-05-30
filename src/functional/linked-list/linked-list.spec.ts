import { LinkedList } from ".";

const randBetween = (lower: number, upper: number) => {
    if (lower < 0 || !Number.isInteger(lower)) {
        throw new Error('lower-bound must be a positive integer.')
    }

    if (upper < 0 || !Number.isInteger(upper)) {
        throw new Error('upper-bound must be a positive integer.');
    }

    if (lower >= upper) {
        throw new Error('lower-bound must not exceed or equal upper-bound');
    }

    return Math.floor(Math.random() * (upper - lower)) + lower;
}

describe('LinkedList', () => {
    it('should initialize', () => {
        expect(() => LinkedList()).not.toThrow();
    });

    describe('LinkedList::isEmpty()', () => {
        it('should be empty on init', () => {
            const list = LinkedList();

            expect(list.isEmpty()).toBe(true);
        });

        it('should not be empty after adding an item to the head', () => {
            const initial = LinkedList();

            expect(initial.isEmpty()).toBe(true);

            let [success, newList] = initial.addHead(randBetween(1, 100));
            expect(success).toBe(true);
            expect(newList?.isEmpty()).toBe(false);
        });

        it('should not be empty after adding items, but should be empty after removing all of them', () => {
            const initial = LinkedList();

            expect(initial.isEmpty()).toBe(true);

            let current = initial;
            const max = 5;

            // add 5 elements
            for (let i = 0; i < max; i++) {
                let [success, updatedList] = current.addHead(randBetween(1, 100));
                current = updatedList!;

                expect(success).toBe(true);
                expect(current?.isEmpty()).toBe(false);
            }

            // remove 5 elements and expect empty on the last one and beyond
            for (let i = max - 1; i > 0; i--) {
                let [success, updatedList] = current.delete(0);
                current = updatedList!;

                console.log(i, success, updatedList?.items.length, updatedList?.isEmpty());

                expect(success).toBe(true);
                expect(current?.isEmpty()).toBe(i === 0);
            }
        });
    });

    // describe('LinkedList::size()', () => {

    // });
})