import { DoublyLinkedList } from "./doubly-linked-list";

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

describe('DoublyLinkedList', () => {
    it('should initialize', () => {
        expect(() => DoublyLinkedList()).not.toThrow();
    });

    describe('ILinkedListNode<T>', () => {
        it('should have the properties "next" and "value"', () => {
            let initial = DoublyLinkedList(1, 2, 3);

            for (let i = 0; i < initial.size(); i++) {
                const [node, index] = initial.at(i);

                expect(node).toBeDefined();
                expect(index).toBe(i);

                expect(node).toHaveProperty("value");
                expect(node).toHaveProperty("next");
                expect(node).toHaveProperty("prev");
            }
        });

        it('should traverse forward if next is not null', () => {
            let initial = DoublyLinkedList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

            for (let i = 0; i < initial.size(); i++) {
                const [node, index] = initial.at(i);

                expect(node).toBeDefined();
                expect(index).toBe(i);

                if (i < initial.size() - 1)
                    expect(node?.next).toBe(initial.items[i + 1]);
                else
                    expect(node?.next).toBeFalsy();
                
                if (i < initial.size() - 2)
                    expect(node?.next?.next).toBe(initial.items[i + 2]);
                else
                    expect(node?.next?.next).toBeFalsy();

                if (i < initial.size() - 3)
                    expect(node?.next?.next?.next).toBe(initial.items[i + 3]);
                else
                    expect(node?.next?.next?.next).toBeFalsy();
            }
        });

        it('should have consistent forward linkage', () => {
            let initial = DoublyLinkedList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

            for (let i = 0; i < initial.size(); i++) {
                const [node, index] = initial.at(i);

                expect(node).toBeDefined();
                expect(index).toBe(i);

                if (i < initial.size() - 1)
                    expect(node?.next).toBe(initial.items[i + 1]);
                else
                    expect(node?.next).toBeFalsy();
                
                if (i < initial.size() - 2)
                    expect(node?.next?.next).toBe(initial.items[i + 2]);
                else
                    expect(node?.next?.next).toBeFalsy();

                if (i < initial.size() - 3)
                    expect(node?.next?.next?.next).toBe(initial.items[i + 3]);
                else
                    expect(node?.next?.next?.next).toBeFalsy();
            }
        });

        it('should have consistent backward linkage', () => {
            let initial = DoublyLinkedList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

            for (let i = 0; i < initial.size(); i++) {
                const [node, index] = initial.at(i);

                expect(node).toBeDefined();
                expect(index).toBe(i);

                if (i > 0)
                    expect(node?.prev).toBe(initial.items[i - 1]);
                else
                    expect(node?.prev).toBeFalsy();
                
                if (i > 1)
                    expect(node?.prev?.prev).toBe(initial.items[i - 2]);
                else
                    expect(node?.prev?.prev).toBeFalsy();

                if (i > 2)
                    expect(node?.prev?.prev?.prev).toBe(initial.items[i - 3]);
                else
                    expect(node?.prev?.prev?.prev).toBeFalsy();
            }
        });
    })

    describe('DoublyLinkedList::isEmpty()', () => {
        it('should be empty on init', () => {
            const list = DoublyLinkedList();

            expect(list.isEmpty()).toBe(true);
        });

        it('should not be empty after adding an item to the head', () => {
            const initial = DoublyLinkedList();

            expect(initial.isEmpty()).toBe(true);

            let [success, newList] = initial.addHead(randBetween(1, 100));
            expect(success).toBe(true);
            expect(newList?.isEmpty()).toBe(false);
        });

        it('should not be empty after adding items, but should be empty after removing all of them', () => {
            const initial = DoublyLinkedList();

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

    describe('DoublyLinkedList::size()', () => {
        it ('should have a size of 0 when initialized', () => {
            const initial = DoublyLinkedList();

            expect(initial.size()).toBe(0);
        });

        it ('should have a size of 5 when 5 items are added on init', () => {
            const initial = DoublyLinkedList(1, 2, 3, 4, 5);

            expect(initial.size()).toBe(5);
        });

        it ('should have a size of 5 when 3 items are added on init and 2 are added to head after', () => {
            const initial = DoublyLinkedList(1, 2, 3);

            expect(initial.size()).toBe(3);

            let [success, updatedList] = initial.addTail(4, 5);

            expect(updatedList?.size()).toBe(5);
        });

        it ('should have a size of 5 when initialized with 5 items, and decrease in size as all are removed', () => {
            let current = DoublyLinkedList(1, 2, 3, 4, 5);

            expect(current.size()).toBe(5);

            for (let i = 4; i > 0; i--) {
                let [success, updatedList] = current.delete(0);

                expect(success).toBe(true);
                expect(updatedList?.size()).toBe(i);
                current = updatedList!;
            }
        });
    });
    
    describe('DoublyLinkedList::head()', () => {
        it('should return a null head for empty list', () => {
            let initial = DoublyLinkedList();

            let [node, index] = initial.head();
            expect(node).toBe(null);
            expect(index).toBe(null);
        })

        it('should return correct head for list with 1 item', () => {
            let initial = DoublyLinkedList();

            let [node, index] = initial.head();
            expect(node).toBe(null);
            expect(index).toBe(null);
        });

        it('should return correct head for list with 3 items', () => {
            let initial = DoublyLinkedList(1, 2, 3);

            let [node, index] = initial.head();
            expect(node?.value).toBe(1);
            expect(index).toBe(0);
            expect(node?.next?.value).toBe(2);
            expect(node?.next?.next?.value).toBe(3);
        });

        it('should return correct head for list with 5 items', () => {
            let initial = DoublyLinkedList(1, 2, 3, 4, 5);

            let [node, index] = initial.head();
            expect(node?.value).toBe(1);
            expect(index).toBe(0);
            expect(node?.next?.value).toBe(2);
            expect(node?.next?.next?.value).toBe(3);
            expect(node?.next?.next?.next?.value).toBe(4);
            expect(node?.next?.next?.next?.next?.value).toBe(5);
        });

        it('should return updated head when the current head is removed', () => {
            let initial = DoublyLinkedList(1, 2, 3, 4, 5);
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

    describe('DoublyLinkedList::tail()', () => {
        it('should return a null tail for empty list', () => {
            let initial = DoublyLinkedList();
            expect(initial.size()).toBe(0);

            let [node, index] = initial.tail();
            expect(node).toBe(null);
            expect(index).toBe(null);
        });

        it ('should return correct tail for list with 1 item', () => {
            let initial = DoublyLinkedList(1);
            expect(initial.size()).toBe(1);

            let [node, index] = initial.tail();
            expect(node?.value).toBe(1);
            expect(index).toBe(initial.items.length - 1);
        });

        it ('should return correct tail for list with 3 items', () => {
            let initial = DoublyLinkedList(1, 2, 3);
            expect(initial.size()).toBe(3);

            let [node, index] = initial.tail();
            expect(node?.value).toBe(3);
            expect(index).toBe(initial.items.length - 1);
        });

        it ('should return correct tail for list with 5 items', () => {
            let initial = DoublyLinkedList(1, 2, 3, 4, 5);
            expect(initial.size()).toBe(5);

            let [node, index] = initial.tail();
            expect(node?.value).toBe(5);
            expect(index).toBe(initial.items.length - 1);
        });

        it ('should return updated tail when tail is removed', () => {
            let initial = DoublyLinkedList(1, 2, 3, 4, 5);
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

    describe('DoublyLinkedList::find(number)', () => {
        it('should return null when the list is empty', () => {
            let initial = DoublyLinkedList();

            expect(initial.size()).toBe(0);

            let [node, index] = initial.find(42);
            expect(node).toBe(null);
            expect(index).toBe(null);
        });

        it('should find the correct value given a list with 5 elements and no duplicated values', () => {
            let initial = DoublyLinkedList(5, 2, 19, 6, 11);

            expect(initial.size()).toBe(5);
            
            let [node, index] = initial.find(19);
            expect(node?.value).toBe(19);
            expect(index).toBe(2);
        });

        it('should find the first correct value given a list with 5 elements and 1 duplicated value', () => {
            let initial = DoublyLinkedList(5, 25, 19, 6, 25);

            expect(initial.size()).toBe(5);
            
            let [node, index] = initial.find(25);
            expect(node?.value).toBe(25);
            expect(index).toBe(1);
        });

        it('should find the first correct value given a deep match for a list of 3 object elements and no duplicated values', () => {
            const items = [
                { name: 'John', age: 45, preferences: { theme: 'light', mfa: false }},
                { name: 'Mark', age: 43, preferences: { theme: 'dark', mfa: true }},
                { name: 'Harry', age: 56, preferences: { theme: 'light', mfa: true }},
            ];
            const initial = DoublyLinkedList<{ name: string; age: number; preferences: { theme: string; mfa: boolean; }}>(...items);

            expect(initial.size()).toBe(3);

            let [node, index] = initial.find(items.at(0)!);
            
            expect(node?.value).toStrictEqual({ name: 'John', age: 45, preferences: { theme: 'light', mfa: false }});
            expect(node?.next?.value).toStrictEqual({ name: 'Mark', age: 43, preferences: { theme: 'dark', mfa: true }});
            expect(index).toBe(0);
        });

        it('should find the first correct value given a deep match for a list of 3 object elements and a duplicated value', () => {
            const items = [
                { name: 'John', age: 45, preferences: { theme: 'light', mfa: false }},
                { name: 'John', age: 45, preferences: { theme: 'light', mfa: false }},
                { name: 'Harry', age: 56, preferences: { theme: 'light', mfa: true }},
            ];
            const initial = DoublyLinkedList<{ name: string; age: number; preferences: { theme: string; mfa: boolean; }}>(...items);

            expect(initial.size()).toBe(3);

            let [node, index] = initial.find(items.at(0)!);
            
            expect(node?.value).toStrictEqual(items.at(0)!);
            expect(node?.next?.value).toStrictEqual(items.at(1)!);
            expect(index).toBe(0);
        });

        it('should find the first correct value given a near-deep match for a list of 3 object elements and a duplicated value', () => {
            const items = [
                { name: 'John', age: 45, preferences: { theme: 'light', mfa: false }},
                { name: 'John', age: 45, preferences: { theme: 'light', mfa: true }}, // mfa is set to true here, so it should not match
                { name: 'Harry', age: 56, preferences: { theme: 'light', mfa: true }},
            ];
            const initial = DoublyLinkedList<{ name: string; age: number; preferences: { theme: string; mfa: boolean; }}>(...items);

            expect(initial.size()).toBe(3);

            let [node, index] = initial.find(items.at(0)!);
            
            expect(node?.value).toStrictEqual(items.at(0)!);
            expect(node?.next?.value).toStrictEqual(items.at(1)!);
            expect(index).toBe(0);
        });

        it('should return safely but non-successfully given a near-deep match for a list of 3 object elements and no fully-matching value', () => {
            const items = [
                { name: 'John', age: 45, preferences: { theme: 'light', mfa: false }},
                { name: 'George', age: 45, preferences: { theme: 'light', mfa: true }}, // mfa is set to true here, so it should not match
                { name: 'Harry', age: 56, preferences: { theme: 'light', mfa: true }},
            ];
            const initial = DoublyLinkedList<{ name: string; age: number; preferences: { theme: string; mfa: boolean; }}>(...items);

            expect(initial.size()).toBe(3);

            let [node, index] = initial.find({ name: 'John', age: 45, preferences: { theme: 'light', mfa: true }});
            
            expect(node).toBe(null);
            expect(index).toBe(null);
        });

        it('should fail find a value when no deep match can be found in a list of 3 object elements and no duplicated values', () => {
            const initial = DoublyLinkedList(
                { name: 'John', age: 45, preferences: { theme: 'light', mfa: false }},
                { name: 'Mark', age: 43, preferences: { theme: 'dark', mfa: true }},
                { name: 'Harry', age: 56, preferences: { theme: 'light', mfa: true }},
            );

            expect(initial.size()).toBe(3);

            // mfa is not the correct value, so we should not find this item
            let [node, index] = initial.find({ name: 'John', age: 45, preferences: { theme: 'light', mfa: false }});

            expect(node).toBe(null);
            expect(index).toBe(null);
        });
    });

    describe('DoublyLinkedList::at(number)', () => {
        it('should return null when the list is empty', () => {
            let initial = DoublyLinkedList();

            expect(initial.size()).toBe(0);

            let [node, index] = initial.at(0);
            expect(node).toBe(null);
            expect(index).toBe(null);
        });

        it('should return the correct value for list with 1 item', () => {
            let initial = DoublyLinkedList(15);

            expect(initial.size()).toBe(1);

            let [node, index] = initial.at(0);
            expect(node?.value).toBe(15);
            expect(index).toBe(0);
        });

        it('should return the correct value for list with 3 items', () => {
            let initial = DoublyLinkedList(15, 7, 28);

            expect(initial.size()).toBe(3);

            let [node, index] = initial.at(1);
            expect(node?.value).toBe(7);
            expect(index).toBe(1);
        });

        it('should return the correct value after deleting values in the middle', () => {
            let initial = DoublyLinkedList(15, 7, 28, 18, 10);

            expect(initial.size()).toBe(5);

            let current = initial;

            for(let i = 0; i < 2; i++) {
                let [node, index] = current.at(1);
                expect(index).toBe(1);

                switch(i) {
                    case 0:
                        expect(node?.value).toBe(7);
                        break;
                    case 1:
                        expect(node?.value).toBe(28);
                        break;
                    case 2:
                        expect(node?.value).toBe(18);
                        break;
                }

                const [success, updatedList] = current.delete(1);
                expect(success).toBe(true);
                current = updatedList!;
            }
        });

        it('should return safely but non-successfully given an index that does not exist in the linked list', () => {
            let initial = DoublyLinkedList(15, 7, 28, 18, 10);

            expect(initial.size()).toBe(5);
            
            const [node, index] = initial.at(8);
            expect(node).toBe(null);
            expect(index).toBe(null);
        })

    });

    describe('DoublyLinkedList::addHead(...number[])', () => {
        it('should return an updated list when adding a single item to the tail of a list', () => {
            let initial = DoublyLinkedList();
            
            expect(initial.size()).toBe(0);

            const newItems = [500];

            const [success, updatedList] = initial.addHead(...newItems);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(newItems.length);
        });

        it('should return an updated list when adding multiple items to the tail of a list at the same time', () => {
            let initial = DoublyLinkedList();
            
            expect(initial.size()).toBe(0);

            const newItems = [150, 673];

            const [success, updatedList] = initial.addHead(...newItems);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(newItems.length);
            expect(updatedList?.at(0)[0]?.value).toBe(150);
            expect(updatedList?.at(1)[0]?.value).toBe(673);
        });

        it('should return a correct list when adding a single item to the tail of a list with 2 items', () => {
            let initial = DoublyLinkedList(35, 62);

            expect(initial.size()).toBe(2);

            const newItems = [14];

            const [success, updatedList] = initial.addHead(...newItems);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(2 + newItems.length);
            expect(updatedList?.at(0)[0]?.value).toBe(14);
            expect(updatedList?.at(1)[0]?.value).toBe(35);
            expect(updatedList?.at(2)[0]?.value).toBe(62);
        });

        it('should return a correct list when adding multiple items to the tail of a list with 2 items', () => {
            let initial = DoublyLinkedList(35, 62);

            expect(initial.size()).toBe(2);

            const newItems = [14, 21];

            const [success, updatedList] = initial.addHead(...newItems);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(2 + newItems.length);
            expect(updatedList?.at(0)[0]?.value).toBe(14);
            expect(updatedList?.at(1)[0]?.value).toBe(21);
            expect(updatedList?.at(2)[0]?.value).toBe(35);
            expect(updatedList?.at(3)[0]?.value).toBe(62);
        });

        it('should add 1,000 items within an average of 50ms', () => {
            const itemCount = 1000; // add this many items
            const expectWithin = 50; // milliseconds
            const testIterations = 50; // run this many test iterations
    
            // function that runs a single iteration of this test
            function runInsertion(): number {
                const initial = DoublyLinkedList();

                // insert 10,000 elements within 50ms
                let current = initial;
                const insertionStart = Date.now();
                for (let i = 0; i < itemCount; i++) {
                    let [,updatedList] = current.addHead(randBetween(1, 5));
                    current = updatedList!;
                }
                const insertionEnd = Date.now();

                return (insertionEnd - insertionStart);
            }

            const tests: number[] = [];
            for (let i = 0; i < testIterations; i++) {
                tests.push(runInsertion());
            }

            const averageTime = tests.reduce((prev, next) => prev + next, 0) / tests.length;

            expect(averageTime).toBeLessThanOrEqual(expectWithin);
        });

        it('should locate an item at a random index of a list with 1,000 elements within 50ms', () => {
            const itemCount = 1000; // add this many items
            const expectWithin = 50; // milliseconds
            const testIterations = 50; // run this many test iterations

            // function that runs a single iteration of this test
            function runFindTest(): number {
                const initial = DoublyLinkedList();
                let current = initial;
                for (let i = 0; i < itemCount; i++) {
                    let [,updatedList] = current.addHead(randBetween(1, 5));
                    current = updatedList!;
                }

                const randomIndex = randBetween(400, 1000);
                const { value: findValue } = current.items.at(randomIndex)!;

                // locate an item within 50ms
                const findStart = Date.now();
                const [node] = current.find(findValue);
                const findEnd = Date.now();

                return (findEnd - findStart);
            }

            const tests: number[] = [];
            for (let i = 0; i < testIterations; i++) {
                tests.push(runFindTest());
            }

            const averageTime = tests.reduce((prev, next) => prev + next, 0) / tests.length;

            expect(averageTime).toBeLessThanOrEqual(expectWithin);
        });
    });

    describe('DoublyLinkedList::addTail(...number[])', () => {
        it('should return an updated list when adding a single item to the tail of a list', () => {
            let initial = DoublyLinkedList();
            
            expect(initial.size()).toBe(0);

            const newItems = [500];

            const [success, updatedList] = initial.addTail(...newItems);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(newItems.length);
        });

        it('should return an updated list when adding multiple items to the tail of a list at the same time', () => {
            let initial = DoublyLinkedList();
            
            expect(initial.size()).toBe(0);

            const newItems = [150, 673];

            const [success, updatedList] = initial.addTail(...newItems);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(newItems.length);
            expect(updatedList?.at(0)[0]?.value).toBe(150);
            expect(updatedList?.at(1)[0]?.value).toBe(673);
        });

        it('should return a correct list when adding a single item to the tail of a list with 2 items', () => {
            let initial = DoublyLinkedList(35, 62);

            expect(initial.size()).toBe(2);

            const newItems = [14];

            const [success, updatedList] = initial.addTail(...newItems);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(2 + newItems.length);
            expect(updatedList?.at(0)[0]?.value).toBe(35);
            expect(updatedList?.at(1)[0]?.value).toBe(62);
            expect(updatedList?.at(2)[0]?.value).toBe(14);
        });

        it('should return a correct list when adding multiple items to the tail of a list with 2 items', () => {
            let initial = DoublyLinkedList(35, 62);

            expect(initial.size()).toBe(2);

            const newItems = [14, 21];

            const [success, updatedList] = initial.addTail(...newItems);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(2 + newItems.length);
            expect(updatedList?.at(0)[0]?.value).toBe(35);
            expect(updatedList?.at(1)[0]?.value).toBe(62);
            expect(updatedList?.at(2)[0]?.value).toBe(14);
            expect(updatedList?.at(3)[0]?.value).toBe(21);
        });
    });

    describe('DoublyLinkedList::remove(...number[])', () => {
        it('should return safely but non-successfully when removing from an empty list', () => {
            let initial = DoublyLinkedList();

            expect(initial.size()).toBe(0);

            const [success, updatedList] = initial.remove(42);
            expect(success).toBe(false);
            expect(updatedList).toBe(null);
        });

        it('should return safely but non-successfully when removing from a list that does not contain the value', () => {
            let initial = DoublyLinkedList(55, 62, 99);

            expect(initial.size()).toBe(3);

            const [success, updatedList] = initial.remove(42);
            expect(success).toBe(false);
            expect(updatedList).toBe(null);
        });

        it('should successfully remove the first matching value when removing a single value from a list that contains all values and no duplicates', () => {
            let initial = DoublyLinkedList(55, 62, 99);

            expect(initial.size()).toBe(3);

            const [success, updatedList] = initial.remove(99);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(2);
        });

        it('should successfully remove the first matching value when removing a single value from a list that contains all values and 1 duplicated value', () => {
            let initial = DoublyLinkedList(11, 55, 55, 62);

            expect(initial.size()).toBe(4);
            expect(initial?.at(0)[0]?.value).toBe(11);
            expect(initial?.at(1)[0]?.value).toBe(55);
            expect(initial?.at(2)[0]?.value).toBe(55);
            expect(initial?.at(3)[0]?.value).toBe(62);

            const [success, updatedList] = initial.remove(55);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(3);
            expect(updatedList?.at(0)[0]?.value).toBe(11);
            expect(updatedList?.at(1)[0]?.value).toBe(55);
            expect(updatedList?.at(2)[0]?.value).toBe(62);
        });

        it('should successfully remove the first of each matching value when removing multiple values from a list that contains all values and no duplicates', () => {
            let initial = DoublyLinkedList(55, 62, 99);

            expect(initial.size()).toBe(3);

            const [success, updatedList] = initial.remove(62, 99);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(1);
        });

        it('should successfully remove the first of each matching value when removing multiple values from a list that contains all values and 1 duplicated value', () => {
            let initial = DoublyLinkedList(11, 55, 55, 62);

            expect(initial.size()).toBe(4);
            expect(initial?.at(0)[0]?.value).toBe(11);
            expect(initial?.at(1)[0]?.value).toBe(55);
            expect(initial?.at(2)[0]?.value).toBe(55);
            expect(initial?.at(3)[0]?.value).toBe(62);

            const [success, updatedList] = initial.remove(11, 55);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(2);
            expect(updatedList?.at(0)[0]?.value).toBe(55);
            expect(updatedList?.at(1)[0]?.value).toBe(62);
        });

        it('should successfully remove the the first of each matching value when removing multiple values from a list that contains all but one value and no duplicates', () => {
            let initial = DoublyLinkedList(11, 55, 62);

            expect(initial.size()).toBe(3);
            expect(initial?.at(0)[0]?.value).toBe(11);
            expect(initial?.at(1)[0]?.value).toBe(55);
            expect(initial?.at(2)[0]?.value).toBe(62);

            const [success, updatedList] = initial.remove(11, 42);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(2);
            expect(updatedList?.at(0)[0]?.value).toBe(55);
            expect(updatedList?.at(1)[0]?.value).toBe(62);
        });
    });

    describe('DoublyLinkedList::delete(...number[])', () => {
        it('should return safely but non-successfully when deleting a node at an index that does not exist', () => {
            let initial = DoublyLinkedList();

            expect(initial.size()).toBe(0);
            
            const [success, updatedList] = initial.delete(2);
            expect(success).toBe(false);
            expect(updatedList).toBe(null);
        });

        it('should successfully delete a single index from a list and update the head', () => {
            let initial = DoublyLinkedList(14, 67, 10);

            expect(initial.size()).toBe(3);
            expect(initial?.at(0)[0]?.value).toBe(14);
            expect(initial?.at(1)[0]?.value).toBe(67);
            expect(initial?.at(2)[0]?.value).toBe(10);
            expect(initial?.head()[0]?.value).toBe(14);

            const [success, updatedList] = initial.delete(0);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(2);
            expect(updatedList?.at(0)[0]?.value).toBe(67);
            expect(updatedList?.at(1)[0]?.value).toBe(10);
            expect(updatedList?.head()[0]?.value).toBe(67);
        });

        it('should successfully delete multiple indicies from a list and update the head', () => {
            let initial = DoublyLinkedList(14, 67, 10, 99, 45);

            expect(initial.size()).toBe(5);
            expect(initial?.at(0)[0]?.value).toBe(14);
            expect(initial?.at(1)[0]?.value).toBe(67);
            expect(initial?.at(2)[0]?.value).toBe(10);
            expect(initial?.at(3)[0]?.value).toBe(99);
            expect(initial?.at(4)[0]?.value).toBe(45);
            expect(initial?.head()[0]?.value).toBe(14);

            const [success, updatedList] = initial.delete(0, 2);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(3);
            expect(updatedList?.at(0)[0]?.value).toBe(67);
            expect(updatedList?.at(1)[0]?.value).toBe(99);
            expect(updatedList?.at(2)[0]?.value).toBe(45);
        });

        it('should successfully delete multiple indicies from a list even if one specified index does not exist', () => {
            let initial = DoublyLinkedList(14, 67, 10, 99, 45);

            expect(initial.size()).toBe(5);
            expect(initial?.at(0)[0]?.value).toBe(14);
            expect(initial?.at(1)[0]?.value).toBe(67);
            expect(initial?.at(2)[0]?.value).toBe(10);
            expect(initial?.at(3)[0]?.value).toBe(99);
            expect(initial?.at(4)[0]?.value).toBe(45);
            expect(initial?.head()[0]?.value).toBe(14);

            const [success, updatedList] = initial.delete(0, 8);
            expect(success).toBe(true);
            expect(updatedList?.size()).toBe(4);
            expect(updatedList?.at(0)[0]?.value).toBe(67);
            expect(updatedList?.at(1)[0]?.value).toBe(10);
            expect(updatedList?.at(2)[0]?.value).toBe(99);
            expect(updatedList?.at(3)[0]?.value).toBe(45);
        });
    })

    describe('DoublyLinkedList::insert(number, ...T[])', () => {
        it('should add an item to the head of the linked list', () => {
            let initial = DoublyLinkedList(1, 2, 3);

            expect(initial.size()).toBe(3);
            expect(initial.at(0)[0]?.value).toBe(1);
            expect(initial.at(1)[0]?.value).toBe(2);
            expect(initial.at(2)[0]?.value).toBe(3);
            expect(initial.head()[0]?.value).toBe(1);

            const [success, updatedList] = initial.insert(0, 5);
            expect(success).toBe(true);
            expect(updatedList!.size()).toBe(4);
            expect(updatedList!.at(0)[0]?.value).toBe(5);
            expect(updatedList!.at(1)[0]?.value).toBe(1);
            expect(updatedList!.at(2)[0]?.value).toBe(2);
            expect(updatedList!.at(3)[0]?.value).toBe(3);
            expect(updatedList?.head()[0]?.value).toBe(5);
        });

        it('should add an item to the tail of the linked list', () => {
            let initial = DoublyLinkedList(1, 2, 3);

            expect(initial.size()).toBe(3);
            expect(initial.at(0)[0]?.value).toBe(1);
            expect(initial.at(1)[0]?.value).toBe(2);
            expect(initial.at(2)[0]?.value).toBe(3);
            expect(initial.tail()[0]?.value).toBe(3);

            const [success, updatedList] = initial.insert(3, 5);
            expect(success).toBe(true);
            expect(updatedList!.size()).toBe(4);
            expect(updatedList!.at(0)[0]?.value).toBe(1);
            expect(updatedList!.at(1)[0]?.value).toBe(2);
            expect(updatedList!.at(2)[0]?.value).toBe(3);
            expect(updatedList!.at(3)[0]?.value).toBe(5);
            expect(updatedList?.tail()[0]?.value).toBe(5);
        })

        it('should add an item to the middle of the linked list', () => {
            let initial = DoublyLinkedList(1, 2, 3);

            expect(initial.size()).toBe(3);
            expect(initial.at(0)[0]?.value).toBe(1);
            expect(initial.at(1)[0]?.value).toBe(2);
            expect(initial.at(2)[0]?.value).toBe(3);

            const [success, updatedList] = initial.insert(1, 5);
            expect(success).toBe(true);
            expect(updatedList!.size()).toBe(4);
            expect(updatedList!.at(0)[0]?.value).toBe(1);
            expect(updatedList!.at(1)[0]?.value).toBe(5);
            expect(updatedList!.at(2)[0]?.value).toBe(2);
            expect(updatedList!.at(3)[0]?.value).toBe(3);
        })

        it('should fail to an item if the starting index is greater than the size of the existing list', () => {
            let initial = DoublyLinkedList(1, 2, 3);

            expect(initial.size()).toBe(3);
            expect(initial.at(0)[0]?.value).toBe(1);
            expect(initial.at(1)[0]?.value).toBe(2);
            expect(initial.at(2)[0]?.value).toBe(3);

            const [success, updatedList] = initial.insert(6, 5);
            expect(success).toBe(false);
            expect(updatedList).toBe(null);
        })

        it('should fail to an item if the starting index is less than 0', () => {
            let initial = DoublyLinkedList(1, 2, 3);

            expect(initial.size()).toBe(3);
            expect(initial.at(0)[0]?.value).toBe(1);
            expect(initial.at(1)[0]?.value).toBe(2);
            expect(initial.at(2)[0]?.value).toBe(3);

            const [success, updatedList] = initial.insert(-4, 5);
            expect(success).toBe(false);
            expect(updatedList).toBe(null);
        })
    });

    describe('DoublyLinkedList::values()', () => {
        it('should return an empty array if the linked list is empty', () => {
            let initial = DoublyLinkedList();

            expect(initial.size()).toBe(0);

            const array = initial.values();
            expect(array).toStrictEqual([]);
        });

        it('should return an array of the same size with the same values', () => {
            let initial = DoublyLinkedList(1, 2, 3);

            expect(initial.size()).toBe(3);
            expect(initial.at(0)[0]?.value).toBe(1);
            expect(initial.at(1)[0]?.value).toBe(2);
            expect(initial.at(2)[0]?.value).toBe(3);

            const array = initial.values();
            expect(array).toStrictEqual([1, 2, 3]);
        });
    });
})