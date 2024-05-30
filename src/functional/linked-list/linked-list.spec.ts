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

                expect(success).toBe(true);
                expect(current?.isEmpty()).toBe(i === 0);
            }
        });
    });

    describe('LinkedList::size()', () => {
        it ('should have a size of 0 when initialized', () => {
            const initial = LinkedList();

            expect(initial.size()).toBe(0);
        });

        it ('should have a size of 5 when 5 items are added on init', () => {
            const initial = LinkedList(1, 2, 3, 4, 5);

            expect(initial.size()).toBe(5);
        });

        it ('should have a size of 5 when 3 items are added on init and 2 are added to head after', () => {
            const initial = LinkedList(1, 2, 3);

            expect(initial.size()).toBe(3);

            let [success, updatedList] = initial.addTail(4, 5);

            expect(updatedList?.size()).toBe(5);
        });

        it ('should have a size of 5 when initialized with 5 items, and decrease in size as all are removed', () => {
            let current = LinkedList(1, 2, 3, 4, 5);

            expect(current.size()).toBe(5);

            for (let i = 4; i > 0; i--) {
                let [success, updatedList] = current.delete(0);

                expect(success).toBe(true);
                expect(updatedList?.size()).toBe(i);
                current = updatedList!;
            }
        });
    });
    
    describe('LinkedList::head()', () => {
        it('should return a null head for empty list', () => {
            let initial = LinkedList();

            let [node, index] = initial.head();
            expect(node).toBe(null);
            expect(index).toBe(null);
        })

        it('should return correct head for list with 1 item', () => {
            let initial = LinkedList();

            let [node, index] = initial.head();
            expect(node).toBe(null);
            expect(index).toBe(null);
        });

        it('should return correct head for list with 3 items', () => {
            let initial = LinkedList(1, 2, 3);

            let [node, index] = initial.head();
            expect(node?.value).toBe(1);
            expect(index).toBe(0);
            expect(node?.next?.value).toBe(2);
            expect(node?.next?.next?.value).toBe(3);
        });

        it('should return correct head for list with 5 items', () => {
            let initial = LinkedList(1, 2, 3, 4, 5);

            let [node, index] = initial.head();
            expect(node?.value).toBe(1);
            expect(index).toBe(0);
            expect(node?.next?.value).toBe(2);
            expect(node?.next?.next?.value).toBe(3);
            expect(node?.next?.next?.next?.value).toBe(4);
            expect(node?.next?.next?.next?.next?.value).toBe(5);
        });

        it('should return updated head when the current head is removed', () => {
            let initial = LinkedList(1, 2, 3, 4, 5);
            expect(initial.size()).toBe(5);

            let [node, index] = initial.head();
            expect(node?.value).toBe(1);
            expect(index).toBe(0);

            expect(node?.next?.value).toBe(2);

            let [success, updatedList] = initial.delete(0);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(4);

            let [updatedHead, updatedIndex] = updatedList!.head();
            expect(updatedIndex).toBe(0);
            expect(updatedHead?.value).toBe(2);
            expect(updatedHead?.next?.value).toBe(3);
        });
    });

    describe('LinkedList::tail()', () => {
        it('should return a null tail for empty list', () => {
            let initial = LinkedList();
            expect(initial.size()).toBe(0);

            let [node, index] = initial.tail();
            expect(node).toBe(null);
            expect(index).toBe(null);
        });

        it ('should return correct tail for list with 1 item', () => {
            let initial = LinkedList(1);
            expect(initial.size()).toBe(1);

            let [node, index] = initial.tail();
            expect(node?.value).toBe(1);
            expect(index).toBe(initial.items.length - 1);
        });

        it ('should return correct tail for list with 3 items', () => {
            let initial = LinkedList(1, 2, 3);
            expect(initial.size()).toBe(3);

            let [node, index] = initial.tail();
            expect(node?.value).toBe(3);
            expect(index).toBe(initial.items.length - 1);
        });

        it ('should return correct tail for list with 5 items', () => {
            let initial = LinkedList(1, 2, 3, 4, 5);
            expect(initial.size()).toBe(5);

            let [node, index] = initial.tail();
            expect(node?.value).toBe(5);
            expect(index).toBe(initial.items.length - 1);
        });

        it ('should return updated tail when tail is removed', () => {
            let initial = LinkedList(1, 2, 3, 4, 5);
            expect(initial.size()).toBe(5);

            let [node, index] = initial.tail();
            expect(node?.value).toBe(5);
            expect(index).toBe(initial.items.length - 1);

            expect(node?.next).toBe(null);

            let [success, updatedList] = initial.delete(initial.items.length - 1);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(4);

            let [updatedTail, updatedIndex] = updatedList!.tail();
            expect(updatedIndex).toBe(updatedList!.items.length - 1);
            expect(updatedTail?.value).toBe(4);
            expect(updatedTail?.next).toBe(null);
        });
    });
})