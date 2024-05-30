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
    addHead(value: T): MutationResult<T>;

    /**
     * Adds an element to the back of the linked list, becoming the last element.
     * @param value 
     */
    addTail(value: T): MutationResult<T>;

    /**
     * Finds an element by value, ensuring deep equality if T is an object type, and removes it then relinks the list.
     * @param value
     */
    remove(value: T): MutationResult<T>;

    /**
     * Deletes an element at a given value then relinks the list.
     * @param value
     */
    delete(index: number): MutationResult<T>;

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

    const items = itemsUnlinked.map((v: ILinkedListNode<T>, index: number) => (
        {
            ...v,
            next: index > 0 ? itemsUnlinked[index - 1] : null
        }) as ILinkedListNode<T>);

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
        for (const key of Object.keys(left)) {
            // recursive case: if we have an object property, recurse into child object
            if (typeof left[key] === 'object' && !Array.isArray(left[key]) && !deepEquals(left[key], right[key])) return false;

            // base case: if we have a primitive type
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
        } while (current?.next)

        return [null, null];
    }

    const at = (target: number): RetrievalResult<T> => {
        if (target >= size()) return [null, null];

        let index = 0;
        const [headNode] = head();
        let current = headNode;

        do {
            if (index === target) {
                // return the current node because it matches
                return [current, index];
            }

            if (current?.next) {
                // move to the next node
                current = current?.next
            }

            index = index + 1;
        } while (current && index !== target);

        return [null, null];
    }

    const addHead = (value: T): MutationResult<T> => {
        try {
            const newList = LinkedList<T>(...[value].concat(items.map((v: ILinkedListNode<T>) => v.value as T)));

            return [true, newList]
        } catch {
            return [false, null];
        }
    };

    const addTail = (value: T): MutationResult<T> => {
        try {
            const newList = LinkedList<T>(...items.map((v: ILinkedListNode<T>) => v.value as T).concat(value));

            return [true, newList];
        } catch {
            return [false, null];
        }
    }

    function del(index: number): MutationResult<T> {
        try {
            const newItems: (T | null)[] = [...items].map(v => v.value);
            newItems[index] = null;

            const newList = LinkedList<T>(...newItems.filter(v => v !== null) as T[]);
            return [true, newList];
        } catch {
            return [false, null];
        }
    }

    function remove(value: T): MutationResult<T> {
        const [, removeIndex] = find(value);

        if (removeIndex === null) return [false, null];

        return del(removeIndex);
    }

    return {
        items,
        head,
        tail,
        find,
        at,
        addHead,
        addTail,
        remove,
        delete: del,
        isEmpty,
        size
    };
}
