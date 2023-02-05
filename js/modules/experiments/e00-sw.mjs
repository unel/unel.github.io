import { registerSW } from '/js/modules/utils/workers.mjs';

function main() {
	registerSW({ url: '/sw.mjs', notify: (...args) => console.info(...args) });

	import('/data/1');
	import('/data/12');
}

export { main }
