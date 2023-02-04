function id(x) {
	return x;
}

function times(n, fn = id) {
	return Array.from(Array(n), (_, n) => fn(n))
}

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


function makeNode(nodeName = 'div', children) {
	const node = document.createElement(nodeName);

	if (children) {
		if (typeof children === 'string') {
			node.innerText = children;
		}
		else if (children.length) {
			for (const child of children) {
				node.appendChild(child)
			}
		}
	}

	return node;
}

function makeStyleClass(name) {
	const styleClass = makeId(['style', name].filter(id).join('-') + '-');
	const styleNode = makeNode('style');

	styleNode.innerHTML = `
		.${styleClass} {

		}
	`;

	document.head.appendChild(styleNode);
	return { styleNode, styleClass };
}

function makeMovable(target) {
	const { styleClass, styleNode } = makeStyleClass('movable');

	target.classList.add(styleClass);
}

function appendBodyChild(node) {
	document.body.appendChild(node);
}

function qs(selectors) {
	return document.querySelector(selectors);
}

function qsa(selectors) {
	return document.querySelectorAll(selectors);
}


export { makeMovable, makeStyleClass, qs, qsa, appendBodyChild, makeNode }
