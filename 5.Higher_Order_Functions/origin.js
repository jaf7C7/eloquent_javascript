const SCRIPTS = require('./scripts.js');

// Average year of origin
const average = array => {
	return array.reduce((a, b) => a + b) / array.length;
};

// ...of all scripts
console.log(average(SCRIPTS.map(script => script.year)));

// ...of living scripts...
const living = SCRIPTS.filter(script => script.living);
console.log(Math.round(average(living.map(script => script.year)))); // → 1165

// ...of dead scripts...
const dead = SCRIPTS.filter(script => !script.living);
console.log(Math.round(average(dead.map(script => script.year)))); // → 204

