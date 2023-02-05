import { openDB, createStore, runInTransaction } from "/js/modules/utils/idb.mjs"

async function main () {
	const db = await openDB('data', 1, (db) => {
		createStore(db, 'files', { autoIncrement: true });
	});

	await runInTransaction(db, ['files'], 'readwrite', ([filesStorage]) => {
			filesStorage.add({
				content: `alert('hello, world!11');`,
				mimeType: 'text/javascript',
			});
	});

	const data = await runInTransaction(db, ['files'], 'readonly', async ([files]) => {
		const cursor = await files.getCursor();
		const dataList = [];

		for await (const data of cursor) {
			console.log('d', data);
			dataList.push(data);
		}

		return dataList;
	});

	const keys = await runInTransaction(db, ['files'], 'readonly', async ([files]) => {
		const cursor = await files.getKeyCursor();
		const dataList = [];

		for await (const data of cursor) {
			console.log('d', data);
			dataList.push(data);
		}

		return dataList;
	});

	console.log('experiment', data, keys);
}

// // Module.run('experiments/e02-indexed-db')
export { main }
