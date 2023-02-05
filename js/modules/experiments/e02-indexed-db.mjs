import { openDB, createStore, runInTransaction } from "/js/modules/utils/idb.mjs"

async function main () {
	const db = await openDB('data', 1, (db) => {
		createStore(db, 'files', { autoIncrement: true });
	});

	runInTransaction(db, ['files'], 'readwrite', ([filesStorage]) => {
			filesStorage.add({
				content: `alert('hello, world!');`,
				mimeType: 'text/javascript',
			});
	});

	runInTransaction(db, ['files'], 'readonly', async ([files]) => {
		const cursor = await files.getCursor();
		const dataList = [];

		for await (const data of cursor) {
			console.log('d', data);
			dataList.push(data);
		}

		return dataList;
	});

// // Module.run('experiments/e02-indexed-db')
export { main }
