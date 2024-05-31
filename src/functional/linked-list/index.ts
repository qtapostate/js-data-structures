/** Single linked list implemented as a higher-order function. */

export interface ILinkedListNode<T> {
    value: T;
    next: ILinkedListNode<T> | null;
}

type MutationResult<T> = [success: boolean, list: ILinkedList<T> | null];
type RetrievalResult<T> = [node: ILinkedListNode<T> | null, index: number | null];
type StringIndexable<T> = { [key: string]: unknown };

export interface ILinkedList<T> {
    // Properties
    items: ILinkedListNode<T>[];

    // Retrieval Functions

    /**
     * Retrieves the head (first element) of the linked list.
     * @param value 
     */
    head(): RetrievalResult<T>;

    /**
     * Retrieves the tail (last element) of the linked list.
     * @param value 
     */
    tail(): RetrievalResult<T>;

    /**
     * Finds the first element that matches the specified value, ensuring deep equality if T is an object type.
     * @param value 
     */
    find(value: T): RetrievalResult<T>;

    /**
     * Finds an element by index.
     * @param value 
     */
    at(index: number): RetrievalResult<T>;

    // Mutation Functions

    /**
     * Adds an element to the front of the linked list, becoming the first element.
     * @param value
     */
    addHead(...value: T[]): MutationResult<T>;

    /**
     * Adds n elements to the linked list starting inclusively at a specified index, pushing other elements up by n positions
     * @param value
     */
    insert(at: number, ...value: T[]): MutationResult<T>;

    /**
     * Adds an element to the back of the linked list, becoming the last element.
     * @param value 
     */
    addTail(...value: T[]): MutationResult<T>;

    /**
     * Finds an element by value, ensuring deep equality if T is an object type, and removes it then relinks the list.
     * @param value
     */
    remove(...value: T[]): MutationResult<T>;

    /**
     * Deletes an element at a given value then relinks the list.
     * @param value
     */
    delete(...index: number[]): MutationResult<T>;

    // Utility Functions

    /**
     * Returns true if the linked list is empty (has no elements).
     */
    isEmpty(): boolean;

    /**
     * Returns the size of the linked list.
     */
    size(): number;
}

export function LinkedList<T = number>(...values: T[]) {

    // first create them unlinked so the space is allocated and the array is fully constructed
    const itemsUnlinked: ILinkedListNode<T>[] = values.map((v: T) => ({ value: v, next: null}) as ILinkedListNode<T>);

    const items = [...itemsUnlinked];

    for (let i = itemsUnlinked.length; i > 0; i--) {
        items[i - 1].next = i < itemsUnlinked.length ? items[i] : null
    }

    // simple primitive or array-type equality
    const equals = (left: any, right: any) => {
        // if either is an array and the other is not an array (logical xor)
        if (Array.isArray(left) != Array.isArray(right)) return false;

        // simple primitive checks
        if (typeof left !== typeof right) return false;
        if (left !== right) return false;

        return true;
    }

    // deep equality for checking objects
    const deepEquals = <U extends { [k: string]: any } = T extends object ? T : never>(left: U, right: U): boolean => {
        const keys = new Set([
            ...Object.keys(left),
            ...Object.keys(right)
        ]);

        // for each key
        for (const key of keys) {
            if (typeof left[key] !== typeof right[key]) return false;
            if (typeof left[key] === 'object' && JSON.stringify(left[key]) !== JSON.stringify(right[key])) {
                return false;
            }

            if (!equals(left[key], right[key])) return false;
        }

        return true;
    }

    function size(): number {
        return items.length;
    }

    function isEmpty(): boolean {
        return size() === 0;
    }

    const head = (): RetrievalResult<T> => {
        if (isEmpty()) return [null, null];
        
        return [items[0], 0];
    }

    const tail = (): RetrievalResult<T> => {
        if (isEmpty()) return [null, null];

        return at(size() - 1);
    }

    const find = (value: T): RetrievalResult<T> => {
        if (isEmpty()) {
            return [null, null];
        }
    
        const [headNode] = head();
        let current = headNode;
        let index = 0;

        do {
            if (typeof value === 'object' && deepEquals(value as StringIndexable<T>, current?.value as StringIndexable<T>)) {
                return [current, index];
            }

            if (value === items[index].value) {
                return [items[index], index];
            }

            index = index + 1;
        } while (current?.next && index < size())

        return [null, null];
    }

    const at = (target: number): RetrievalResult<T> => {
        if (target < 0 || target >= size()) return [null, null];

        let index = 0;
        const [headNode] = head();
        let current = headNode;

        while (current && index !== target + 1) {
            if (index === target) {
                // return the current node because it matches
                return [current, index];
            }

            if (!current?.next) {
                break;
            }

            current = current?.next
            index = index + 1;
        }

        return [null, null];
    }

    const addHead = (...value: T[]): MutationResult<T> => {
        try {
            const newList = LinkedList<T>(...[...value].concat(items.map((v: ILinkedListNode<T>) => v.value as T)));

            return [true, newList]
        } catch {
            return [false, null];
        }
    };

    const addTail = (...value: T[]): MutationResult<T> => {
        try {
            const newList = LinkedList<T>(...items.map((v: ILinkedListNode<T>) => v.value as T).concat(...value));

            return [true, newList];
        } catch {
            return [false, null];
        }
    }

    const insert = (at: number, ...values: T[]): MutationResult<T> => {
        if (at < 0 || at >= size()) {
            return [false, null];
        }

        try {
            const before = items.map(v => v.value).slice(0, at);
            const after = items.map(v => v.value).slice(at);
            const newList = LinkedList<T>(...before.concat(...values).concat(after));

            return [true, newList];
        } catch {
            return [false, null];
        }
    }

    function del(...indices: number[]): MutationResult<T> {
        try {
            const newItems: (T | null)[] = [...items].map(v => v.value);
            let removed = 0;
            indices.forEach((index) => {
                if (index < size()) {
                    newItems[index] = null;
                    removed = removed + 1;
                }
            });

            if (removed === 0) return [false, null];

            const newList = LinkedList<T>(...newItems.filter(v => v !== null) as T[]);
            return [true, newList];
        } catch {
            return [false, null];
        }
    }

    function remove(...values: T[]): MutationResult<T> {
        const removeIndicies: number[] = values
            .map(find)
            .map(result => result[1])
            .filter(v => typeof v === 'number') as number[];

        if (removeIndicies.length === 0) return [false, null];

        return del(...removeIndicies);
    }

    return {
        items,
        head,
        tail,
        find,
        at,
        addHead,
        addTail,
        insert,
        remove,
        delete: del,
        isEmpty,
        size
    };
}
