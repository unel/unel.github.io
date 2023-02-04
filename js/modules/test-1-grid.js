import { makeNode, listenMap, makeStyleClass, injectStyle } from "./dom-utils.js";
import { times } from './fn-utils';

function makeLabeledInput({ name, label, value, type='text' }) {
	return makeNode('label', { }, [
		new Text(label),
		makeNode('input', { name, value, type })
	]);
}

function main(target = document.body) {
	injectStyle('/css/grid.css');
	injectStyle('/css/forms.css');

	const values = {
		columnsAmount: 10,
		rowsAmount: 10,
	};

	const inputs = {
		columnsAmount: { label: 'columns', value: 10, type: 'number' },
		columnsGap: { value: 10, label: 'columns gap', type: 'number' },
		rowsAmount: { label: 'rows', value: 3, type: 'number' },
		rowsGap: { value: 10, label: 'rows gap', type: 'number' },
	}

	const form = makeNode('form', { class: 'top-right' }, Object.entries(inputs).map(
		([name, { value, label, type }]) => makeLabeledInput({ name, value, label, type })
	));

	const blocks = [];
	const update = (key, value) => {
		values[key] = value;
		target.style.setProperty(`--${key}`, value);

		const requiredBlocksAmount = values.columnsAmount * values.rowsAmount;
		const blocksDelta = requiredBlocksAmount - blocks.length;

		if (blocksDelta > 0) {
			const newBlocks = times(blocksDelta, (n) => makeNode('div'));
			blocks.push(...newBlocks);
			target.appendChild(makeNode('fragment', {}, newBlocks))

			return;
		}

		if (blocksDelta < 0) {
			for (const block of blocks.slpice(blocksDelta)) {
				target.removeChild(block);
			}
		}
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
