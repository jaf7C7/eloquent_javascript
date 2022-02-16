function arrayToList(array) {
	let list = null;
	for (let i = 0; i < array.length; i++) {
		list = { value: array[array.length - 1 - i], rest: list }
	}
	return list;
}

function listToArray(list) {
	let array = [];
	for (let node = list; node; node = node.rest) {
		array.push(node.value);
	}
	return array;
}

function prepend(element, list) {
	return { value: element, rest: list };
}

function nth(list, depth) {
	for (let node = list; node; node = node.rest) {
		if (depth === 0) {
			return node.value;
		} else {
			depth--;
		}
	}
}

function nthRecursive(list, depth) {
	return (depth === 0) ? list.value : nth(list.rest, depth - 1);
}

console.log(arrayToList([10, 20, 30]));
console.log(listToArray(arrayToList([10, 20, 30])));
console.log(prepend(10, prepend(20, prepend(30, null))));
console.log(nth(arrayToList([10, 20, 30]), 3));
console.log(nthRecursive(arrayToList([10, 20, 30]), 3));
