function mkNode(nodeName) {
	if (nodeName === 'fragment') {
		return new document.createDocumentFragment()
	}

	return new document.createElement(nodeName);
}

function setAttributes(node, attributes) {
	if (attributes) {
		for (const [name, value] of Object.entries(attributes)) {
			node.setAttribute(name, value);
		}
	}
}

function addChildren(node, children) {
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
}

function makeNode(nodeName = 'div', attributes, children) {
	const node = mkNode(nodeName);

	addChildren(children);
	setAttributes(attributes);

	return node;
}


function qs(selectors) {
	return document.querySelector(selectors);
}

function qsa(selectors) {
	return document.querySelectorAll(selectors);
}

function makeStyleClass(styleClass) {
	const styleNode = makeNode('style', { name: styleClass });

	styleNode.innerHTML = `.${styleClass} {}`;

	document.head.appendChild(styleNode);
	return { styleNode, styleClass };
}

function injectStyle(stylePath) {
	document.head.appendChild(
		makeNode('link', {
			rel: 'stylesheet',
			href: stylePath,
		})
	);
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


// import('/js/modules/dom-utils.js').then(module => Object.assign(window, module))
export { qs, qsa, makeNode, setAttributes, addChildren, makeStyleClass, listenMap, injectStyle }
