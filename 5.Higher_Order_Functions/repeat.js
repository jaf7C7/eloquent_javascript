const repeat = (count, action) => {
	for (let i = 0; i < count; i++) action(i);
};

console.log(repeat(5, () => console.log('foo')));
console.log(repeat(5, i => {
	console.log(`Cycle ${i}`);
}));
