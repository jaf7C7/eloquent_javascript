/*
 * Another common thing to do with arrays is to compute a single value from
 * them. Our  recurring example,  summing a  collection of  numbers, is  an
 * instance of this.   Another example is finding the script  with the most
 * characters.
 * 
 * The  higher-order operation  that represents  this pattern  is called
 * reduce (sometimes also called fold). It  builds a value by repeatedly
 * taking a  single element  from the  array and  combining it  with the
 * current value. When  summing numbers,  you’d start with  the number
 * zero and, for each element, add that to the sum.
 * 
 * The  parameters to  reduce are,  apart  from the  array, a  combining
 * function  and  a   start  value. This  function  is   a  little  less
 * straightforward than filter and map, so take a close look at it:
 */

const reduce = (array, reducer, initialValue = array[0]) => {
	let reduction = initialValue;
	for (let element of array) {
		reduction = reducer(reduction, element);
	}
	return reduction;
}

console.log(reduce([1, 2, 3, 4], (a, b) => a + b));

/*
 * To use  reduce (twice) to find  the script with the  most characters, we
 * can write something like this:
 */

const SCRIPTS = require('./scripts.js');

const charCount = (script) => {
	return script.ranges.reduce((counter, [from, to]) => {
		return counter + (to - from);
	}, 0);
};

console.log(SCRIPTS.reduce((a, b) => {
	return (charCount(a) < charCount(b)) ? b : a;
}));
