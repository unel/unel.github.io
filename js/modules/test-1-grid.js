import { makeNode, listenMap, makeStyleClass, injectStyle } from "./dom-utils.js";

function makeLabeledInput({ name, label, value, type='text' }) {
	return makeNode('label', { }, [
		new Text(label),
		makeNode('input', { name, value, type })
	]);
}

function main(target = document.body) {
	injectStyle('/css/grid.css');
	injectStyle('/css/forms.css');

	const inputs = {
		columnsAmount: { label: 'columns', value: 10, type: 'number' },
		columnsGap: { value: 10, label: 'columns gap', type: 'number' },
		rowsAmount: { label: 'rows', value: 3, type: 'number' },
		rowsGap: { value: 10, label: 'rows gap', type: 'number' },
	}

	const form = makeNode('form', { class: 'top-right' }, Object.entries(inputs).map(
		([name, { value, label, type }]) => makeLabeledInput({ name, value, label, type })
	));

	const update = (key, value) => {
		target.style.setProperty(`--${key}`, value);
	}

	const obs = listenMap(
		Object.fromEntries(Object.keys(inputs).map(fieldName => [fieldName, form.elements[fieldName]])),
		update
	);

	target.classList.add('grid');
	target.appendChild(form);

	Object.assign(window, { form, obs });
}

// import('/js/modules/test-1-grid.js').then(module => module.main())
export { main }
