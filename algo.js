
// Dijkstra's Algorithm

/* The point of this algorithm is to find the shortest distance in a weighted
graph from the start node to the end node. */

// first, create an enum for our nodes
const Nodes = {
    book: "book",
    rare_lp: "rare_lp",
    poster: "poster",
    bass_guitar: "bass_guitar",
    drum_set: "drum_set",
    piano: "piano"
}

Object.freeze(Nodes); // ensures the enum cannot change

const graph = new Map([
    [Nodes.book, new Map([
        [Nodes.rare_lp, 5],
        [Nodes.poster, 0]
    ])],
    [Nodes.rare_lp, new Map([
        [Nodes.bass_guitar, 15],
        [Nodes.drum_set, 20]
    ])],
    [Nodes.poster, new Map([
        [Nodes.bass_guitar, 30],
        [Nodes.drum_set, 35]
    ])],
    [Nodes.bass_guitar, new Map([
        [Nodes.piano, 20]
    ])],
    [Nodes.drum_set, new Map([
        [Nodes.piano, 10]
    ])],
    [Nodes.piano, new Map()]
]);

// less pretty waay of setting up graph
// now we'll add the nodes to our graph
// const graph = new Map();
// graph.set(Nodes.book, new Map());
// graph.set(Nodes.rare_lp, new Map());
// graph.set(Nodes.poster, new Map());
// graph.set(Nodes.bass_guitar, new Map());
// graph.set(Nodes.drum_set, new Map());
// graph.set(Nodes.piano, new Map()); // note we leave this empty

// // now we define the edges for the nodes in our graph
// graph.get(Nodes.book).set(Nodes.rare_lp, 5);
// graph.get(Nodes.book).set(Nodes.poster, 0);
// graph.get(Nodes.rare_lp).set(Nodes.bass_guitar, 15);
// graph.get(Nodes.rare_lp).set(Nodes.drum_set, 20);
// graph.get(Nodes.poster).set(Nodes.bass_guitar, 30);
// graph.get(Nodes.poster).set(Nodes.drum_set, 35);
// graph.get(Nodes.bass_guitar).set(Nodes.piano, 20);
// graph.get(Nodes.drum_set).set(Nodes.piano, 10);

// recall that the callback function when using forEach on a map follows (value, key)

// returns the node enum with the lowest cost in the map
const findLowestCost = function(cost, processed) {
    let lowest = null;
    cost.forEach((val, key) => {

        // we ignore nodes (keys) which are already processed
        if (!processed.includes(key)) {

            // if lowest is still null, we haven't found our first value yet
            if (lowest === null) lowest = key;

            // if the current val is less than lowest, replace it
            if (val < cost.get(lowest)) lowest = key;
        }
    });
    return lowest;
}

// here is Dijkstra's Algorithm:
const dijkstra = function(start, graph) {

    /* There are 2 key maps we need to keep track of data while traversing the graph:
    a map of the cost to each node from the start, and a map of parent nodes determined
    by cost. */
    const cost = new Map();
    const parents = new Map();
    // we also need a resizable array to keep track of nodes that have been "processed"
    const processed = [];

    // first we need to add the neighbors of the root to the cost map
    graph.get(start).forEach((edgeValue, neighbor) => {
        cost.set(neighbor, graph.get(start).get(neighbor));
        parents.set(neighbor, start);
    });

    /* Now comes the meat of the algorithm. Until no nodes remain in the cost map,
    we must select the lowest cost node from the cost map, and process it, until 
    no nodes remain in the cost map. */
    while (processed.length < graph.size - 1) {
        let node = findLowestCost(cost, processed);

        /* Now we set the costs of all neighbors of this node, but only if the cost
        has not been set yet, or if the cost from the current node is lower than the
        currently assigned cost */
        graph.get(node).forEach((edges, neighbor) => {
            let costThruNode = cost.get(node) + graph.get(node).get(neighbor);

            /* If the cost map does not already have this neighbor, then it hasn't been 
            encountered yet. */
            if (!cost.has(neighbor)) cost.set(neighbor, costThruNode);
            else if (!processed.includes(node)) {
                
                /* Note the above if statement. We only check for a lower cost if the
                node has not already been processed. */
                if (costThruNode < cost.get(neighbor)) {
                    /* If the cost through the current node to the neighbor is lower that
                    the value in costs, we overwrite the value, and set this node as the
                    parent node of the nieighbor. */
                    cost.set(neighbor, costThruNode);
                    parents.set(neighbor, node);
                }
            }
        });
        // mark node as processed
        processed.push(node);
    }

    return {
        "costs": cost,
        "path": parents
    }
}

console.log(dijkstra(Nodes.book, graph));

console.log("test");