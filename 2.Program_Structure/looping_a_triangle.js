/*
 * Looping a triangle
 * 
 * Write a loop that makes seven calls to console.log to output the following triangle:
 * 
 * #
 * ##
 * ###
 * ####
 * #####
 * ######
 * #######
 */

const printTriangle = (size) => {
	for (let i = '#'; i.length < 8; i += '#') console.log(i);
}

console.log(printTriangle());
