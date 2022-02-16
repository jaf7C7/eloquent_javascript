const map = (array, mapping) => {
	let mapped = [];
	for (let element of array) {
		mapped.push(mapping(element));
	}
	return mapped;
}

let array = [1, 2, 3, 4];
console.log(map(array, x => x * 2));
