/** A Robot **/

/* Defining the village */

// The network of roads in our village forms a *graph* -- A collection of
// points with lines between them (roads between places in the village). The
// robot will move along the lines of the graph.
const roads = [
	"Alice's House-Bob's House",
	"Alice's House-Cabin",
	"Alice's House-Post Office",
	"Bob's House-Town Hall",
	"Daria's House-Ernie's House",
	"Daria's House-Town Hall",
	"Ernie's House-Grete's House",
	"Grete's House-Farm",
	"Grete's House-Shop",
	"Marketplace-Farm",
	"Marketplace-Post Office",
	"Marketplace-Shop",
	"Marketplace-Town Hall",
	"Shop-Town Hall",
];

// The above array of strings isn't that easy to work with -- we would prefer a
// data structure which for each place, tells us what other places can be
// reached from there. The below function, given an array of edges, creates a
// *map* object which, for each node, stores an array of connected nodes.
function buildGraph(edges) {
	let graph = Object.create(null);
	function addEdge(from, to) {
		if (graph[from] == null) {
			graph[from] = [to];
		} else {
			graph[from].push(to);
		}
	}
	for (let [from, to] of edges.map(r => r.split("-"))) {
		addEdge(from, to);
		addEdge(to, from);
	}
	return graph;
}

const roadGraph = buildGraph(roads);
//console.log(roadGraph); // → [Object: null prototype] {
//	"Alice's House": [ "Bob's House", 'Cabin', 'Post Office' ],
//	"Bob's House": [ "Alice's House", 'Town Hall' ],
//	Cabin: [ "Alice's House" ],
//	'Post Office': [ "Alice's House", 'Marketplace' ],
//	'Town Hall': [ "Bob's House", "Daria's House", 'Marketplace', 'Shop' ],
//	"Daria's House": [ "Ernie's House", 'Town Hall' ],
//	"Ernie's House": [ "Daria's House", "Grete's House" ],
//	"Grete's House": [ "Ernie's House", 'Farm', 'Shop' ],
//	Farm: [ "Grete's House", 'Marketplace' ],
//	Shop: [ "Grete's House", 'Marketplace', 'Town Hall' ],
//	Marketplace: [ 'Farm', 'Post Office', 'Shop', 'Town Hall' ]
// }

// There are parcels at various points around the village, which the robot
// needs to pick up and deliver to the correct address. It must decide, at each
// point, where it needs to go next. Once all parcels are delivered its task is
// done.
//
// The challenge is to define the simplest possible model of the village's
// state -- the miminal set of values we need to consider. Defining objects for
// every moving part can become confusing, as can defining objects with dymanic.
// internal state. So to start with we just consider the state of the village
// as a whole, and we create a new village object for each new state.
class VillageState {
	// `place` - current position of the robot (string).
	// `parcels` - locations of undelivered parcels (array of parcel objects
	// which have their own `place` and `address` properties).
	constructor(place, parcels) {
		this.place = place;
		this.parcels = parcels;
	}
	move(destination) {
		// If the destination is *not* reachable from the current location,
		// then the state doesn't change.
		if (!roadGraph[this.place].includes(destination)) {
			return this;
		} else {
			// The `map` call moves the parcels, the `filter` call delivers
			// them.
			let parcels = this.parcels.map(p => {
				// If parcel isn't at the current location, do nothing.
				if (p.place != this.place) return p;
				// Otherwise the robot carries all collected parcels to the new
				// location.
				return {place: destination, address: p.address};
			// Any parcels which are now at the correct address are delivered.
			}).filter(p => p.place != p.address);
			// The new state of the village is returned as a separate object
			// with the new position of the robot and the new (not updated)
			//array of undelivered parcels.
			return new VillageState(destination, parcels);
		}
	}
}

let first = new VillageState(
	// The robot is at the post office.
	"Post Office",
	// There is a single parcel at the Post Office addressed to Alice.
	[{place: "Post Office", address: "Alice's House"}]
);

// The robot moves to Alice's house, where the parcel is delivered. But the
// previous state of the village is preserved.
//
// The point of this is to manage complexity -- moving to Alice's house from a
// given initial state always produces the same result. Dynamic objects can be
// difficult to manage and understand. What we can't understand we can't build.
// Having *immutable* or *persistent* data like this is desirable but not
// always possible.
let next = first.move("Alice's House");

//console.log(next.place); // → Alice's House
//console.log(next.parcels); // → []
//console.log(first.place); // → Post Office

/* Building the first prototype (random) robot */

// So far we have manually moved a parcel and updated the village state. But we
// really want our robot to do this for us. So we want to design a robot that,
// given the current state of the village, will move of its own accord to the 
// next appropriate place. We can say that the robot is a function of the state
// of the village. It may also be useful for the robot to have some working 
// memory, in case there are things it needs to record along the way.
//
// The below function sets the robot in motion -- the robot will continue to
// move around the village until all parcels are delivered.
function runRobot(state, robot, memory) {
	// Record the number of turns taken to deliver all the parcels.
	for (let turn = 0;; turn++) {
		// If there are no more parcels left, then we're done.
		if (state.parcels.length == 0) {
			console.log(`Done in ${turn} turns`);
			break;
		}
		// The action taken by the robot depends on the state of the village
		// and potentially information stored in its memory. The action will
		// almost inevitably involve moving to a new destination.
		let action = robot(state, memory);
		// The state of the village is updated.
		state = state.move(action.direction);
		// The memory of the robot is updated.
		memory = action.memory;
		console.log(`Moved to ${action.direction}`);
	}
}

// What remains to be defined is the robot function itself, which returns an
// `action` object with `direction` and `memory` properties.
// But we must first define *how* the robot will determine its next move...
//
// The simplest possible strategy is to pick a random direction at each turn --
// this won't be very efficient but will eventually pass traverse the whole
// graph.
//
// Pick a random element from an array.
function randomPick(array) {
	let choice = Math.floor(Math.random() * array.length);
	return array[choice];
}
// This prototype `random` robot will choose a random road from our graph. It
// has no need to remember anything as all its decisions are purely random.
function randomRobot(state) {
	return {direction: randomPick(roadGraph[state.place])};
}

// To test out this robot it's useful to be able to create a random initial
// state for our system, this is defined as a *static* method on our
// VillageState class (i.e. a method defined on the constructor/class instead
// of on an instance of the class/constructor).
VillageState.random = function(parcelCount = 5) {
	let parcels = [];
	for (let i = 0; i < parcelCount; i++) {
		// Assign a random address for each parcel.
		let address = randomPick(Object.keys(roadGraph));
		let place;
		do {
			// Assign a random starting place
			place = randomPick(Object.keys(roadGraph));
		// If that random place is the destination address pick a new starting
		// place.
		} while (place == address);
		// Add the parcel object to the parcel array.
		parcels.push({place, address});
	}
	return new VillageState("Post Office", parcels);
};

// This `randomRobot` prototype gets the job done but is not very efficient.
// See https://eloquentjavascript.net/code/#7 for a helpful animation.
//runRobot(VillageState.random(), randomRobot);
// → Moved to Marketplace
// → Moved to Town Hall
// → ...
// → Done in 63 turns

/* Building the second prototype robot, which follows a predefined route */

// A better way might be to plan a mail route through the village which visits
// each location twice, allowing for all parcels to be collected and delivered.
// This route starts from the post office:
const mailRoute = [
	"Alice's House", "Cabin", "Alice's House", "Bob's House",
	"Town Hall", "Daria's House", "Ernie's House",
	"Grete's House", "Shop", "Grete's House", "Farm",
	"Marketplace", "Post Office"
];

// For this new prototype `routeRobot` we will need it to store the planned
// route in its memory, so it knows where to go next.
// This function removes the first location from the mailroute at each turn,
// keeping the rest in its memory. When all the locations have been visited,
// the mail route is loaded again into its memory for another round.
function routeRobot(state, memory) {
	if (memory.length == 0) {
		memory = mailRoute;
	}
	return {direction: memory[0], memory: memory.slice(1)};
}

// This robot is a lot faster.
//runRobot(VillageState.random(), routeRobot, mailRoute);
// → ...
// → Done in 18 turns

/* Build a third prototype robot, which "intelligently" plots its own route */

// A much more efficient robot would be one which can decide for itself where
// to go based on the locations of all the parcels.
//
// The problem of finding a route through a graph is a typical *search problem*
// in programming. The solution is not directly computable so we have to look
// at several options until we find one that works.
//
// While the number of possible routes through the graph is infinite, we can
// reduce the problem by defining some criteria:
//   1. When searching for a route between points A and B, we only care about
//      routes starting at point A.
//   2. We don't care about routes which visit the same place twice, as that's
//      not efficient.
//   3. We want the *shortest* route between two given points.
//
// One approach is to 'grow' routes from the starting point, exploring all
// reachable places until one route finds the destination. This is likely to be
// the shortest (or one of the shortest) routes.
//
// The below function is one such implementation:
function findRoute(graph, from, to) {
	// The `work` array lists the routes to be explored. It begins at the start
	// point `from` with an empty route.
	let work = [{at: from, route: []}];
	// The following looks at each new place reachable from the current one.
	// If a reachable place is the destination point `to`, then it returns the
	// route to get there.
	// If the destination is not yet found, each new reachable point is
	// appended to the work list, and will be explored in turn.
	for (let i = 0; i < work.length; i++) {
		let {at, route} = work[i];
		// Recall `graph` is of the form {place: [reachable place, ...], ...}
		// Iterate over each new place reachable from the current place.
		for (let place of graph[at]) {
			// If the current place is the destination, we have found a route.
			if (place == to) return route.concat(place);
			// If a place is already in the work list, then it has either:
			//   1. Already been explored, and so the route to that point would
			//      either be:
			//        a. Going back on itself.
			//        b. A less direct (i.e. longer) route to get to that same
			//           point than has already been found, and since we want
			//           short routes, we can discount it.
			//  2. Already been marked for exploration by another route, and so
			//     the route to that point would also be either as long, or
			//     longer than an existing route to that place.
			//
			// It is important that points reached first must be explored
			// first, to avoid missing potential shorter routes. If we were to
			// explore each new reachable place immediately it would amount to
			// more of a stab in the dark approach, rather than methodical
			// traversal. Iterating over the `work` array achieves this.
			//
			// So if one of the new reachable places is *not* present in the work
			// list, then we add it to the list for further exploration.
			//
			// This approach can be visualised as a web of lines spreading out
			// from the starting point, each growing at an equal rate.
			if (!work.some(w => w.at == place)) {
				work.push({at: place, route: route.concat(place)});
			}
		}
	}
}

// The above function does not handle the situation where there are no more
// work items on the work list, because we know that our graph is *connected*,
// meaning that every location is reachable (through some path) from every
// other location. The search can't fail since we will always be able to find
// *some* route betweeen any two points.

// So we can build a shiny new robot which will implement this new pathfinding
// algorithm.
// `{place, parcels}` is shorthand for `state`
function goalOrientedRobot({place, parcels}, route) {
	if (route.length == 0) {
		// Head towards first undelivered parcel.
		let parcel = parcels[0];
		// If the parcel is not at the current place.
		if (parcel.place != place) {
			// Plot a route to the parcel.
			route = findRoute(roadGraph, place, parcel.place);
		} else {
			// Plot a route to the delivery address.
			route = findRoute(roadGraph, place, parcel.address);
		}
	}
	// Return the action object, which contains the next road to take, along
	// with the remainder of the route, minus the first stop.
	return {direction: route[0], memory: route.slice(1)};
}

// Let's test this new robot:
// We see that it's slightly better than the robot which follows the mail
// route but still not optimal!
runRobot(VillageState.random(), goalOrientedRobot, mailRoute);
// → Done in 16 turns

// NOTE: The graph search algorithm above is known as a `breadth-first` search.
//       More information on graphs and search algorithms here:
//         https://www.youtube.com/watch?v=cWNEl4HE2OE

/* Exercises */


