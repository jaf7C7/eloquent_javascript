// Iterable groups
// 
// Make the Group class from the previous exercise iterable. Refer to the
// section about the iterator interface earlier in the chapter if you aren’t
// clear on the exact form of the interface anymore.
// 
// If you used an array to represent the group’s members, don’t just
// return the iterator created by calling the Symbol.iterator method on the
// array. That would work, but it defeats the purpose of this exercise.
// 
// It is okay if your iterator behaves strangely when the group is modified
// during iteration.
// 
// It is probably worthwhile to define a new class GroupIterator. Iterator
// instances should have a property that tracks the current position in the
// group. Every time next is called, it checks whether it is done and, if not,
// moves past the current value and returns it.
// 
// The Group class itself gets a method named by Symbol.iterator that, when
// called, returns a new instance of the iterator class for that group.
// 
// Your code here (and the code from the previous exercise)
class Group {
	constructor() {
		this.members = [];
	}
	has(member) {
		return this.members.includes(member);
	}
	add(member) {
		if (!this.has(member)) this.members.push(member);
	}
	delete(member) {
		if (this.has(member))
			this.members = this.members.filter(m => m !== member);
	}
	static from(iterable) {
		let group = new Group();
		for (let item of iterable) group.add(item);
		return group;
	}
	[Symbol.iterator]() {
		let members = this.members;
		return {
			current: 0,
			next() {
				if (this.current == members.length) {
					return {done: true};
				}
				return {value: members[this.current++],
					done: false};
			}
		}
	}
}

for (let value of Group.from(["a", "b", "c"])) {
	console.log(value);
}
// → a
// → b
// → c
