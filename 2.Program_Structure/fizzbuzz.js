/*
 * FizzBuzz
 * 
 * Write a program that uses console.log to print all the numbers from 1 to
 * 100,  with two  exceptions. For  numbers divisible  by  3, print  "Fizz"
 * instead of the number, and for numbers divisible by 5 (and not 3), print
 * "Buzz" instead.
 * 
 * When you have that working, modify  your program to print "FizzBuzz" for
 * numbers that are  divisible by both 3  and 5 (and still  print "Fizz" or
 * "Buzz" for numbers divisible by only one of those).
 * 
 */

const fizzBuzz = (a, b) => {
	for (let i = a; i < b; i++) {
		// '0 || foo' returns foo since 0 is falsey
		console.log((i % 3) ? '' : 'Fizz' + (i % 5) ? '' : 'Buzz' || i);
	}
}

console.log(fizzBuzz(1, 100));
