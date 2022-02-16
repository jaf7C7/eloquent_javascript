/*
 * To find script name from character code
 */

const SCRIPTS = require('./scripts.js');

const charScript = charCode => {
	for (let script of SCRIPTS) {
		if (script.ranges.some(([from, to]) => {
			return charCode >= from && charCode < to;
		})) return script;
	}
};

console.log(charScript(121)); // → Latin...

/*
 * Javascript uses UTF-16 string encoding
 * use codePointAt() and for..of to avoid half-char errors
 */

let horseShoe = "🐴👠";

console.log(horseShoe.length); // → 4
console.log(horseShoe[0]); // → (invalid half-character)
console.log(horseShoe.charCodeAt(0)); // → 55357 (Code of half-char)
console.log(horseShoe.codePointAt(0)); // → 128052 (Actual code for horse-head emoji)

for (let char of horseShoe) {
	console.log(char);
	console.log(char.codePointAt(0));
}

/*
 * Analysing text:
 */

// A helper function
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

/*
 * countBy iterates over the array and tests if each element is greater than
 * 2. It returns the two groups 'true' and 'false' along with how many elements
 * they each contain.
 */

console.log(countBy([1, 2, 3, 4, 5], n => n > 2));
//→ [ { name: false, count: 2 }, { name: true, count: 3 } ]

const textScripts = text => {
	let scripts = countBy(text, char => {
		let script = charScript(char.codePointAt(0));
		return script ? script.name : "none";
	}).filter(({name}) => name !== "none");

	let total = scripts.reduce((n, {count}) => n + count, 0);
	if (total === 0) return "No scripts found";

	return scripts.map(({name, count}) => {
		return `${Math.round(count * 100 / total)}% ${name}`;
	}).join(", ");
};

/*
 * textScripts makes a call to countBy,  which in turn calls charScript, to
 * determine the character set of each  character in the given text, adding
 * up the  number of characters in  each set. It then calculates  the total
 * number  of characters,  and  returns  each script  name  along with  the
 * percentage of the total text it represents.
 */

console.log(textScripts('英国的狗说"woof", 俄罗斯的狗说"тяв"'));
// → 61% Han, 22% Latin, 17% Cyrillic
