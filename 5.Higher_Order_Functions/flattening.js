/*
 * Use  the  reduce  method  in  combination with  the  concat  method  to
 * “flatten” an array  of arrays into a single array  that has all the
 * elements of the original arrays.
 */

const flatten = array => {
	return array.reduce((flattened, element) => {
		if (typeof element === "object" &&
		    element !== null) element = flatten(element);
		return flattened.concat(element);
	}, []);
};

//let arrays = [[1, 2, 3], [4, 5], [6]];
let arrays = [[1, [2, 3, 4], 5], [6, 7, [8, 9, 10]]];
console.log(flatten(arrays));
