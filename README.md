# JS Data Structures

This is a practice project for making various data structures using Typescript.
JS obviously isn't the best language to use for this, due to lack of tight control over memory and pointers, but it's useful knowledge nonetheless.

For this project I have only a few rules to constrain myself:
1. no dependencies other than development dependencies needed for testing.
2. no use of `class` syntax - only functional programming!
3. everything must have test suites close to 90% coverage - all edge cases should be covered.

Included in this project are (or will be) the following data structures:
* Sets - good for storing ordered or unordered sequences of values
  * `LinkedList` - an ordered list that can be walked forward only.
  * `DoublyLinkedList` - an ordered list that can be walked forward or backward.
  * `HashTable` (WIP)
* Stack - good for storing dependent data
  * `DynamicStack` - a stack that grows as large as needed.
  * `FixedStack` - a stack with a specified size constraint.
* Queue - good for ordering operations in a sequence
  * `DynamicQueue` - a queue that grows as large as needed.
  * `FixedQueue` - a queue with a specified size constraint.
* Graphs - good for mapping a network of relationships, such as decisions available given a current state
  * `DirectedGraph` (WIP)
  * `WeightedDirectedGraph` (WIP)
  * `UndirectedGraph` (WIP)
  * `WeightedUndirectedGraph` (WIP)
* Trees - good for organizing data for fast interpretation
  * `NAryTree` (WIP)
  * `BalancedTree` (WIP)
  * `BinaryTree` (WIP)
  * `BinarySearchTree` (WIP)
  * `AVLTree` (WIP)
  * `RedBlackTree` (WIP)
  * `TwoThreeTree` (WIP)
  * `Trie` (WIP)

---

* Algorithms
  * Graph: Breadth-First Search (WIP)
  * Graph: Depth-First Search (WIP)
  * ... probably more by the time i get around to it.
