const range = (a, b) => {
	let result = [];
	for (let i = a; i <= b; i++) result.push(i);
	return result;
};

const sum = (...args) => {
	let total = 0;
	for (let arg of args) {
		if (typeof arg === 'number') total += arg;
		else if (typeof arg === 'object') for (let key in arg) total += sum(arg[key]);
		else return;
	}
	return total;
};

console.log(range(1, 10));
console.log(sum([1, 2, 3, 4, 5, [6, 7, 8, 9, 10]]));
console.log(sum(range(1, 10)));
