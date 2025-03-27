export default class LinkedList {
    constructor() {
        this.head = null;
    }

    append(data) {
        const newNode = { data, next: null };
        if (!this.head) {
            this.head = newNode;
            newNode.next = this.head;
        } else {
            let current = this.head;
            while (current.next !== this.head) current = current.next;
            current.next = newNode;
            newNode.next = this.head;
        }
    }


    // printList() {
    //     let current = this.head;
    //     if (!current) return;  
    //     do {
    //         console.log(current.data);
    //         current = current.next;
    //     } while (current !== this.head);  
    // }
}

// Example Usage
// const list = new LinkedList();
// list.append(10);
// list.append(20);
// list.append(30);
// list.printList();  // Output: 10 20 30