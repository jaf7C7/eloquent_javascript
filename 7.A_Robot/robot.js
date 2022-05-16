/* Meadowfield */

// The village consists of 11 places connected by 14 roads, as described by
// this array:
const roads = [
	"Alice's House-Bob's House",	"Alice's House-Cabin",
	"Alice's House-Post Office",	"Bob's House-Town Hall",
	"Daria's House-Ernie's House",	"Daria's House-Town Hall",
	"Ernie's House-Grete's House",	"Grete's House-Farm",
	"Grete's House-Shop",			"Marketplace-Farm",
	"Marketplace-Post Office",		"Marketplace-Shop",
	"Marketplace-Town Hall",		"Shop-Town Hall"
];

// This network of roads forms a *graph* of *nodes*/*vertices* connected by
// *edges*.
// https://en.wikipedia.org/wiki/Graph_theory
//
// The above array describes the edges of the graph. The graph can be
// represented in a more useful way, as an *adjacency list*.
// https://en.wikipedia.org/wiki/Adjacency_list
//
// This function will return an adjacency list from the array of edges:
function buildGraph(edges) {
	let graph = Object.create(null);
	function addEdge(graph, from, to) {
		if (!graph[from]) graph[from] = [to];
		else graph[from].push(to);
	}
	for (let [from, to] of roads.map(r => r.split("-"))) {
		addEdge(graph, from, to);
		addEdge(graph, to, from);
	}
	return graph;
}

// `roadGraph` is a *map* object (or, more specifically, an *adjacency list*),
// which for each node, stores an array of connected nodes.
const roadGraph = buildGraph(roads);

/* The Task */

// Create an automated mail robot, which will traverse the village picking up
// and delivering parcels.
//
// Try to keep things as simple as possible, using the minimum amount of
// varibles/objects needed to model the system.
//
// The state of the village can be represented as an object:
class VillageState {
	constructor(place, parcels) {
		// Current location of the robot.
		this.place = place;
		// `parcels` is of the form:
		// `{place: someNode, address: someOtherNode}`
		this.parcels = parcels;
	}

	// `move` method moves the robot and returns a new `VillageState`
	// object.
	move(destination) {
		// If the destination is not reachable the state does not
		// change.
		if (!roadGraph[this.place].includes(destination)) return this;
		// Any parcels at the current location are moved to the next.
		let parcels = this.parcels.map(p => {
			if (p.place != this.place) return p
			return {place: destination, address: p.address};
		// Remove any delivered parcels from the list.
		}).filter(p => p.place != p.address);
		return new VillageState(destination, parcels);
	}
}

// A new state object is created rather than modifying the existing one. The
// `VillageState` object can be said to be an *immutable* or *persistent* data
// structure as opposed to being *dynamic*.
//
// The purpose of this is to reduce complexity and aid understanding.
// Operations can be considered in isolation; moving from a given starting
// state to Alice's house will always produce the same new state. When objects
// change over time it can add new dimensions of complexity.

/* Simulation */

// The robot can be represented as a function which takes a `VillageState`
// object as an argument and returns a destination in which to move. It may be
// useful to give the robot some working memory as well for the purposes of 
// following a route which spans multiple nodes. The robot would then return an
// `action` object of the form `{direction: someNode, memory: nodeList}`.
//
// The following function sets the robot in motion, and runs until all parcels
// have been delivered:

// But what does the `robot` function actually look like? It must be able to
// uniquely determine a direction at each turn, based on the given state of
// the village.
//
// The simplest implementation is a "dumb" robot which moves randomly from
// place to place until all packages are delivered:
function randomPick(array) {
	let choice = Math.floor(Math.random() * array.length);
	return array[choice];
}

function randomRobot(state) {
	// Memory is not necessary for this robot and can be ignored.
	return {direction: randomPick(roadGraph[state.place])};
}

// To test this robot we need a method to initialise a random village state.
// This is defined as a *static* method (a method defined on the class or
// constructor rather than an instance of that class.
VillageState.random = function(parcelCount = 5) {
	let parcels = [];
	for (let i = 0; i < parcelCount; i++) {
		let address = randomPick(Object.keys(roadGraph));
		let place;
		do {
			place = randomPick(Object.keys(roadGraph));
		// Make sure address and starting place are different.
		} while (place == address)
		parcels.push({place, address});
	}
	return new VillageState("Post Office", parcels);
};

// See it in action;
//console.log(runRobot(VillageState.random(), randomRobot));

// Now we have a working simulation we can work on improving the performance of
// the robot.
//
// For example we can program a mail route:
const mailRoute = [
	"Alice's House",
	"Cabin",
	"Alice's House",
	"Bob's House",
	"Town Hall",
	"Daria's House",
	"Ernie's House",
	"Grete's House",
	"Shop",
	"Grete's House",
	"Farm",
	"Marketplace",
	"Post Office"
];

// And load the route into the robot's memory:
function routeRobot(state, memory) {
	// To save having to load the mailRoute each invocation:
	if (memory.length == 0) memory = mailRoute;
	return {direction: memory[0], memory: memory.slice(1)};
}

// Test:
// `[]` is passed as the memory since the robot loads the default route
// automatically if no other route is given.
//console.log(runRobot(VillageState.random(), routeRobot, []));

/* Pathfinding */

// Ideally the robot would intelligently be able to plot an efficient route
// through the village for any given state. This involves a comparing different
// possibilities and making a decision on which way to go.
//
// Finding a route through a graph is a typical *search problem*. The aim is
// to explore multiple possible solutions until one succeeds.
//
// We are interested in the shortest possible routes between two distinct
// points A and B, starting at point A. We can also ignore routes which pass
// through the same place twice. This help us reduce the number of possible
// solutions.
//
// See: https://en.wikipedia.org/wiki/Breadth-first_search 
function findRoute(graph, from, to) {
	let queue = [{at: from, route: []}];
	for (let node of queue) {
		let {at, route} = node;
		for (let next of graph[at]) {
			if (next == to) return route.concat(next);
			// Since we are looking for short routes, and routes
			// "grow" outwards from the starting point equally,
			// any node which is already part of an existing route
			// can be ignored, to avoid routes overlapping.
			if (!queue.some(n => n.at == next)) {
				queue.push({at: next,
				            route: route.concat(next)});
			}
		}
	}
}

// NOTE: We don't handle the situation where the queue (also called a 
// *work list*) runs out before we find our destination. This is because our
// graph is *connected*, meaning that any node on the graph is reachable from
// any other node, so we will always find the destination eventually.

//console.log(findRoute(roadGraph, "Alice's House", "Shop"));

// Using the above we can build a more effective robot; one which finds the
// shortest route to each parcel in turn, and then to the delivery address.
function goalOrientedRobot({place, parcels}, route) {
	if (route.length == 0) {
		let parcel = parcels[0];
		if (parcel.place != place) {
			route = findRoute(roadGraph, place, parcel.place);
		} else {
			route = findRoute(roadGraph, place, parcel.address);
		}
	}
	return {direction: route[0], memory: route.slice(1)};
}

/* Exercises */

// Measuring a robot

// Write a function compareRobots that takes two robots (and their starting
// memory). It should generate 100 tasks and let each of the robots solve each
// of these tasks. When done, it should output the average number of steps each
// robot took per task.
//
// For the sake of fairness, make sure you give each task to both robots,
// rather than generating different tasks per robot.
//
// Modify runRobot function to return number of turns taken to complete the
// system instead of logging to the console:
function runRobot(state, robot, memory) {
	for (let turns = 0;; turns++) {
		if (state.parcels.length == 0) return turns;
		let action = robot(state, memory);
		state = state.move(action.direction);
		memory = action.memory;
	}
}
function compareRobots(robot1, memory1, robot2, memory2) {
	let turns1 = [], turns2 = [];
	for (let i = 0; i < 100; i++) {
		let state = VillageState.random();
		turns1.push(runRobot(state, robot1, memory1));
		turns2.push(runRobot(state, robot2, memory2));
	}
	let avg1 = turns1.reduce((a, b) => a + b) / turns1.length;
	let avg2 = turns2.reduce((a, b) => a + b) / turns2.length;
	console.log("robot1: ", robot1, "\nturns: ", avg1);
	console.log("robot2: ", robot2, "\nturns: ", avg2);
	return (avg1 < avg2 ? "robot1" : "robot2") + " is more efficient";
}

//console.log(compareRobots(routeRobot, [], goalOrientedRobot, []));
// → "goalOrientedRobot is more efficient"

// Robot efficiency

// Can you write a robot that finishes the delivery task faster than
// goalOrientedRobot? If you observe that robot’s behavior, what obviously
// stupid things does it do? How could those be improved?
//
// If you solved the previous exercise, you might want to use your
// compareRobots function to verify whether you improved the robot.
//
// The main limitation with the previous robot is that it heads for each parcel
// in turn, regardless of where that parcel is located. It could better look
// at all the parcels and choose the closest one.
function myRobot({place, parcels}, route) {
	if (route.length == 0) {
		route = parcels.map(p => {
			let dest = p.place != place ? p.place : p.address;
			return findRoute(roadGraph, place, dest);
		}).reduce((a, b) => a.length < b.length ? a : b);
	}
	return {direction: route[0], memory: route.slice(1)};
}

//console.log(runRobot(VillageState.random(), myRobot, []));
//console.log(compareRobots(goalOrientedRobot, [], myRobot, []));
// → "myRobot is more efficient"

// Even better results can (apparently) be obtained by preferring pickup
// routes over deliveries.
//
// TODO: Why is this?
function lazyRobot({place, parcels}, route) {
	if (route.length == 0) {
		// Describe a route for every parcel
		let routes = parcels.map(parcel => {
			if (parcel.place != place) {
				return {route: findRoute(roadGraph,
				                         place,
				                         parcel.place),
				        pickUp: true};
			} else {
				return {route: findRoute(roadGraph,
				                         place,
				                         parcel.address),
				        pickUp: false};
			}
		});

		// This determines the precedence a route gets when choosing.
		// Route length counts negatively, routes that pick up a
		// package get a small bonus.
		function score({route, pickUp}) {
			return (pickUp ? 0.5 : 0) - route.length;
		}
		route = routes.reduce((a, b) => score(a) > score(b) ?
		                                a : b).route;
	}

	return {direction: route[0], memory: route.slice(1)};
}

//console.log(compareRobots(myRobot, [], lazyRobot, []));
// → "lazyRobot is more efficient"

// Persistent group

// Write a new class PGroup, similar to the Group class from Chapter 6,
// which stores a set of values. Like Group, it has add, delete, and has
// methods.
// 
// Its add method, however, should return a new PGroup instance with the
// given member added and leave the old one unchanged. Similarly, delete
// creates a new instance without a given member.
// 
// The class should work for values of any type, not just strings. It does
// not have to be efficient when used with large amounts of values.
// 
// The constructor shouldn’t be part of the class’s interface (though
// you’ll definitely want to use it internally). Instead, there is an
// empty instance, PGroup.empty, that can be used as a starting value.
//
// The most convenient way to represent the set of member values is still
// as an array since arrays are easy to copy.
// 
// When a value is added to the group, you can create a new group with a
// copy of the original array that has the value added (for example, using
// concat). When a value is deleted, you filter it from the array.
// 
// The class’s constructor can take such an array as argument and store
// it as the instance’s (only) property.  This array is never updated.
// 
// To add a property (empty) to a constructor that is not a method, you
// have to add it to the constructor after the class definition, as a
// regular property.
// 
// You need only one empty instance because all empty groups are the same
// and instances of the class don’t change. You can create many different
// groups from that single empty group without affecting it.
// 
// Why do you need only one PGroup.empty value, rather than having a
// function that creates a new, empty map every time?
class PGroup {
	// Your code here
	constructor() {
		this.members = [];
	}
	has(member) {
		return this.members.includes(member);
	}
	delete(member) {
		let p = new PGroup();
		p.members = this.members.filter(m => m !== member);
		return p;
	}
	add(member) {
		let p = new PGroup();
		p.members = this.members.concat(member);
		return p;
	}
}

// We only need a single `PGroup.empty` value because all instances of PGroup
// are *persistent* and therefore immutable.
PGroup.empty = new PGroup();

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b")); // → true
console.log(a.has("b")); // → false
console.log(b.has("a")); // → false
