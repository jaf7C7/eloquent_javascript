// A vector type

// Write a class Vec that represents a vector in two-dimensional space. It
// takes x and y parameters (numbers), which it should save to properties
// of the same name.

// Give the Vec prototype two methods, plus and minus, that take another
// vector as a parameter and return a new vector that has the sum or
// difference of the two vectors’ (this and the parameter) x and y
// values.

// Add a getter property length to the prototype that computes the length
// of the vector—that is, the distance of the point (x, y) from the
// origin (0, 0).

// Look back to the Rabbit class example if you’re unsure how class
// declarations look.

// Adding a getter property to the constructor can be done by putting
// the word get before the method name. To compute the distance from (0,
// 0) to (x, y), you can use the Pythagorean theorem, which says that the
// square of the distance we are looking for is equal to the square of the
// x-coordinate plus the square of the y-coordinate. Thus, √(x^2 + y^2)
// is the number you want, and Math.sqrt is the way you compute a square
// root in JavaScript.

class Vec {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	plus(vec) {
		return new Vec(this.x + vec.x, this.y + vec.y);
	}
	minus(vec) {
		return new Vec(this.x - vec.x, this.y - vec.y);
	}
	get length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
}

console.log(new Vec(1, 2).plus(new Vec(2, 3))); // → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3))); // → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length); // → 5
