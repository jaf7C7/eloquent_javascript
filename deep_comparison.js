function deepEqual(a, b) {
	if (a === b) return true; // trivial case

	// if one is not an object but the other is => false
	// if one is null and the other is => false
	// if both are the not objects and are the same value they are already caught above
	// if both are objects and neither are null then investigate further
	// '&& a' and '&& b' would also work as null is falsey
	if (typeof a !== 'object' || a === null ||
	    typeof b !== 'object' || b === null) return false

	// arrays of property names
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	// same amount of properties?
	if (keysA.length !== keysB.length) return false;

	for (key of keysA) {
		// are all properties of a present in b?
		// are the values of the properties the same? (recursive call since we are
		// just checking if two things are equal again)
		if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
	}

	// sherlock holmes style
	return true;
}

// tests
let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
console.log(deepEqual(obj, {here: 1, object: 2}));
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
