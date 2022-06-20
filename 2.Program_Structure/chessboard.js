/*
 * Chessboard
 * 
 * Write a program that creates a string that represents an 8×8 grid,
 * using newline characters to separate lines. At each position of the grid
 * there is either a space or a "#" character. The characters should form
 * a chessboard.
 * 
 * Passing this string to console.log should show something like this:
 * 
 *  # # # #
 * # # # #
 *  # # # #
 * # # # #
 *  # # # #
 * # # # #
 *  # # # #
 * # # # #
 *
 * When you have a program that generates this pattern, define a binding
 * size = 8 and change the program so that it works for any size, outputting
 * a grid of the given width and height.
 */

const chessboard = (size) => {
	// Initialise a null variable of type `string`.
	let str = '';

	// We want to print a grid, so it makes sense that we
	// need nested 'for' loops; one for each axis.
	//
	// Our chessboard is square, so has dimensions `size * size`.
	//
	// We use simple facts about odd and even number arithmetic:
	// 	`odd + even = odd`
	// 	`odd + odd = even`
	// 	`even + even = even`
	// 	`odd + even = odd`
	// 
	// We can check for "odd/evenness" with the `%` (modulo) operator:
	// 	if (x % 2 == 0) {
	//		// x is even
	//	} else {
	//		// x is odd
	//	}
	// 
	// This can be abbreviated with the ternary operator:
	//	x % 2 == 0 ? /* x is even */ : /* x is odd */
	for (let j = 0; j < size; j++) {
		for (let i = 0; i < size; i++) {
			// 0 + 0 is even -> ' '
			// 0 + 1 is odd -> '#'
			// ...
			// 1 + 0 is odd -> '#'
			// 1 + 1 is even -> ' '
			// ...
			str += (i + j) % 2 === 0 ? ' ' : '#';
		}
		str += "\n";
	}
	return str;
}


// Test
str=`\
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
`
console.log(chessboard(8) == str);
