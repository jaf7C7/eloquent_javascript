const filter = (array, test) => {
	let filtered = [];
	for (let element of array) {
		if (test(element)) filtered.push(element);
	}
	return filtered;
}

let array = [1, 2, 3, 4];
console.log(filter(array, n => n % 2 === 0));
