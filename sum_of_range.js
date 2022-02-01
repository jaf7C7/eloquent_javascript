function range(start, end, step = (end < start) ? -1 : 1) {
	if ((end - start) / step < 0) return 'Invalid parameters';
	let range = [], i = start;
	while (start > end ? i >= end : i <= end) {
		range.push(i);
		i += step;
	}
	return range;
}

function sum(range) {
	let result = 0;
	for (let i of range) result += i;
	return isNaN(result) ? NaN : result;
}

console.log(range(1, 10));
console.log(range(5, 2));
console.log(sum(range(1, 10)));
