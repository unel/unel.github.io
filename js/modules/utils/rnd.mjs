function rnd(from, to) {
	return from + (to - from) * Math.random()
}

function rndPick(arr) {
	return arr[Math.round(rnd(0, arr.length - 1))]
}

const SYMBOLS = [].concat(
	times(16, n => n.toString(16)),
	times(6, n => (n + 10).toString(16).toUpperCase())
);

function makeId(prefix = '', suffix = '') {
	return prefix + times(8, () => rndPick(SYMBOLS)).join('') + suffix;
}

export { rnd, rnd, makeId }
