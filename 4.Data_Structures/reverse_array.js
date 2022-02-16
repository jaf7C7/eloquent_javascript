function reverseArray(array) {
	let result = [];
	for (let i = 0; i < array.length; i++ ) {
		result.push(array[array.length - 1 - i])
	}
	return result;
}

function reverseArrayInPlace(array) {
	for (let i = 0; i < Math.floor(array.length / 2); i++) {
		const temp = array[array.length - 1 - i];
		array[array.length - 1 - i] = array[i];
		array[i] = temp;
	}
	return array;
}

console.log(reverseArray([1, 2, 3, 4, 5]));
console.log(reverseArrayInPlace([1, 2, 3, 4, 5]));

