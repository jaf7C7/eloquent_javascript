/*
 * Write  a function  that computes  the  dominant writing  direction in  a
 * string  of  text. Remember  that  each script  object  has  a  direction
 * property that  can be "ltr" (left  to right), "rtl" (right  to left), or
 * "ttb" (top to bottom).
 * 
 * The  dominant   direction  is   the  direction   of  a   majority  of
 * the  characters   that  have  a  script   associated  with  them. The
 * charScript and countBy functions  defined earlier in the chapter
 * are probably useful here.
 */
const SCRIPTS = require('./scripts.js');

const charScript = charCode => {
	for (let script of SCRIPTS) {
		if (script.ranges.some(([from, to]) => {
			return charCode >= from && charCode < to;
		})) return script;
	}
};

const countBy = (items, groupName) => {
	let counts = [];
	for (let item of items) {
		let name = groupName(item);
		let known = counts.findIndex(count => count.name === name);
		if (known === -1) {
			counts.push({name, count: 1});
		} else {
			counts[known].count++;
		}
	}
	return counts;
};

const dominantDirection = (text) => {
	const directions = countBy(text, char => {
		let script = charScript(char.codePointAt(0));
		return script ? script.direction : "none";
	}).filter(({name}) => name !== "none");

	if (directions.length === 0) return "Unknown";

	/*
	 * Returning a.name or b.name will not work as it passes the name
	 * to the next iteration of the function rather than the object itself
	 */
	return directions.reduce((a, b) => (a.count < b.count) ? b : a).name;
};


console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
console.log(dominantDirection("!"));
// → Unknown
