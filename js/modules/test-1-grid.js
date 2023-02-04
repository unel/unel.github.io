import { makeNode, listenMap, makeStyleClass, injectStyle } from "./dom-utils.js";

function main(target = document.body) {
	injectStyle('/css/grid.css');
	const values = {};

	const update = (key, value) => {
		values[key] = value;

		target.style.setProperty(`--${key}`, value);
	}


	const form = makeNode('form', {}, [
		makeNode('input', { name: 'columnsAmount' }),
		makeNode('input', { name: 'columnsGap' }),
	]);

	const obs = listenMap({
		'columnsAmount': form.elements.columnsAmount,
		'columnsGap': form.elements.columnsGap,
	}, update);

	target.classList.add('grid');
	target.appendChild(form);

	Object.assign(window, { form, obs, values });
}

// import('/js/modules/test-1-grid.js').then(module => module.main())
export { main }
