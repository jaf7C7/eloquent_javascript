const noisy = f => {
	return (...args) => {
		console.log(`Calling function ${f} with args ${args}`);
		return `returned: ${f(...args)}`;
	}
};

console.log(noisy(range)(1, 10));
