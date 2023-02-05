import { makeNode, listenMap, makeStyleClass, injectStyle } from "/js/modules/utils/dom.mjs";
import { times } from '/js/modules/utils/fn.mjs';

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
		rowsAmount: 3,
	};

	const inputs = {
		columnsAmount: { label: 'columns', value: 10, type: 'number' },
		columnsGap: { value: 10, label: 'columns gap', type: 'number' },
		rowsAmount: { label: 'rows', value: 3, type: 'number' },
		rowsGap: { value: 10, label: 'rows gap', type: 'number' },
		itemsCount: { value: 30, label: 'items', type: 'number' },
	}

	const form = makeNode('form', { class: 'top-right' }, Object.entries(inputs).map(
		([name, { value, label, type }]) => makeLabeledInput({ name, value, label, type })
	));

	const blocks = [];
	const update = (key, value) => {
		values[key] = value;
		target.style.setProperty(`--${key}`, value);

		const requiredBlocksAmount = values.itemsCount;
		const blocksDelta = requiredBlocksAmount - blocks.length;

		if (blocksDelta > 0) {
			const newBlocks = times(blocksDelta, (n) => makeNode('div', { class: 'grid-item' }));
			blocks.push(...newBlocks);
			target.appendChild(makeNode('fragment', {}, newBlocks))

			return;
		}

		if (blocksDelta < 0) {
			for (const block of blocks.splice(blocksDelta)) {
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

// import('/js/modules/experiments/e01-grid.mjs').then(module => module.main())
export { main }
