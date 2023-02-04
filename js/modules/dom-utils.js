function makeNode(nodeName = 'div', attributes, children) {
	const node = document.createElement(nodeName);

	if (attributes) {
		for (const [name, value] of Object.entries(attributes)) {
			node.setAttribute(name, value);
		}
	}

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


function qs(selectors) {
	return document.querySelector(selectors);
}

function qsa(selectors) {
	return document.querySelectorAll(selectors);
}

function makeStyleClass(name) {
	const styleClass = name;
	const styleNode = makeNode('style');

	styleNode.innerHTML = `
		.${styleClass} {

		}
	`;

	document.head.appendChild(styleNode);
	return { styleNode, styleClass };
}


function listen(node, event, cb) {
	node.addEventListener(event, cb);

	return () => {
		node.removeEventListener(event, cb);
	}
}

function listenMap(elementsMap, cb) {
	let cleaners = [];
	const unlisten = () => {
		for (const clean of cleaners) { clean(); }
		cleaners = [];
	};

	for (const [key, inputNode] of Object.entries(elementsMap)) {
		cleaners.push(listen(inputNode, 'input', e => cb(key, e.target.value)));
		cb(key, inputNode.value)
	}

	return unlisten;
}


export { qs, qsa, makeNode, makeStyleClass, listenMap, }
