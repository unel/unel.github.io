function id(x) {
	return x;
}

function times(n, fn = id) {
	return Array.from(Array(n), (_, n) => fn(n))
}

export { id, times }
