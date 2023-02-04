import { makeNode, listenMap, makeStyleClass } from "./dom-utils.js";

function main(target = document.body) {
	const values = {};

	const update = (key, value) => {
		values[key] = value;

		target.style.setProperty(`--${key}`, value);
	}


	const form = makeNode('form', {}, [
		makeNode('input', { name: 'columnsAmount' }),
		makeNode('input', { name: 'columnWidth'}),
		makeNode('input', { name: 'columnGap' }),
	]);

	const obs = listenMap({
		'columnsAmount': form.elements.columnsAmount,
		'columnWidth': form.elements.columnWidth,
		'columnGap': form.elements.columnGap,
	}, update);

	makeStyleClass('grid');
	target.classList.add('grid');
	target.appendChild(form);

	Object.assign(window, { form, obs, values });
}

// import('/js/modules/test-1-grid.js').then(module => module.main())
export { main }
