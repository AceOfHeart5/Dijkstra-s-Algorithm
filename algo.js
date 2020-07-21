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

/* This is reduced syntax for setting up a nested map. Note that the map constructor 
only accepts one argument, which is an array of short [key, value] arrays. So any map
created actually accepts a 2D array as it's argument, hence the huge number of []s. */
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

/* In this function, cost is a map of keys and values, and processed is an array of
keys that have already been processed. This function returns the key with the lowest
cost of all entries in cost that are not in processed. */
const findLowestCost = function(cost, processed) {
    let lowest = null;

    /* Recall that the callback function when using forEach on a map 
    follows (value, key). */
    cost.forEach((val, key) => {

        // we ignore nodes (keys) which are already processed
        if (!processed.includes(key)) {

            // if lowest is still null, we haven't found our first value yet
            if (lowest === null) lowest = key;

            // if the current val is less than lowest, val is the new lowest
            if (val < cost.get(lowest)) lowest = key;
        }
    });
    return lowest;
}

// here is Dijkstra's Algorithm:
const dijkstra = function(graph, start, end) {

    /* There are 2 maps we need to keep track of data while traversing the graph: a map 
    of the cost to each node from the start, and a map of parent nodes determined by 
    cost. */
    const cost = new Map();
    const parents = new Map();

    // we also need a resizable array to keep track of nodes that have been "processed"
    const processed = [];

    /* First we need to add the neighbors of the root to the cost map, and set their 
    parents. */
    graph.get(start).forEach((edgeValue, neighbor) => {
        cost.set(neighbor, graph.get(start).get(neighbor));
        parents.set(neighbor, start);
    });

    /* Now comes the meat of the algorithm. We process each node in the graph. Note that
    we are checking the size graph.size - 1 because we have already processed the start
    node. */
    while (processed.length < graph.size - 1) {

        // We begin by finding the lowest cost, unprocessed node.
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
                    /* If the cost through the current node to the neighbor is lower than
                    the value in cost, we overwrite the value, and set this node as the
                    parent node of the nieighbor. */
                    cost.set(neighbor, costThruNode);
                    parents.set(neighbor, node);
                }
            }
        });

        // mark node as processed
        processed.push(node);
    }

    /* Now the entire graph has been processed and we can return our results. Firstly, if
    there is no cost logged for `end`, then there was no path from `start` to `end`. */
    if (!cost.has(end)) return ``;
    let results = `The shortest path from ${start} to ${end} is: `;
    return {
        "costs": cost,
        "path": parents
    }
}

console.log(dijkstra(Nodes.book, graph));
