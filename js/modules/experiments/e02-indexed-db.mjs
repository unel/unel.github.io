import { openDB, createStore, runInTransaction } from "/js/modules/utils/idb.mjs"

async function main () {
	const db = await openDB('data', 1, (db) => {
		createStore(db, 'files', { autoIncrement: true });
	});

	runInTransaction(db, ['files'], 'readwrite', ([filesStorage]) => {
			debugger;
			filesStorage.add({
				content: `alert('hello, world!');`,
				mimeType: 'text/javascript',
			});
	});
}

// // Module.run('experiments/e02-indexed-db')
export { main }
