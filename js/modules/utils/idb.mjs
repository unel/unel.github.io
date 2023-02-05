function openDB(dbName, version, initFn) {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, version);

		request.onerror = (event) => {
			console.log(`openDB "${dbName}" / v ${version} error`, event);

			reject(event.target.errorCode);
		};

		request.onupgradeneeded = (event) => {
			console.log(`openDB "${dbName}" / v ${version} onupgradeneeded`, event);
			const db = event.target.result;
			initFn(db);
		};

		request.onsuccess = (event) => {
			console.log(`openDB "${dbName}" / v ${version} success`, event);

			resolve(event.target.result);
		};
	})
}

function createStore(db, storeName, options) {
	db.createObjectStore(storeName, options)
}

function makeStoreRequest(store, method, ...args) {
	return new Promise((resolve, reject) => {
		const request = store[method](...args);

		request.onerror = (event) => {
			reject(event);
		};

		request.onsuccess = (event) => {
			resolve(event);
		};
	});
}

class Store {
	constructor(storeObject) {
		this._storeObject = storeObject;
		this._requestPromises = [];
	}

	getByKey(key) {
		return this._makeAndKeepRequest('get', key);
	}

	deleteByKey(key) {
		return this._makeAndKeepRequest('delete', key);
	}

	add(data) {
		return this._makeAndKeepRequest('add', data);
	}

	put(data) {
		return this._makeAndKeepRequest('put', data);
	}

	_makeAndKeepRequest(method, ...args) {
		const requestPromise = makeStoreRequest(this._storeObject, method, ...args);

		this._requestPromises.push(requestPromise);

		return requestPromise;
	}
}

function runInTransaction(db, storeNames, mode, cb) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeNames, mode);
		const stores = storeNames.map(storeName => new Strore(transaction.objectStore(storeName)))

		transaction.onerror = (event) => {
			reject(event);
		};
		transaction.onsuccess = (event) => {
			resolve(event);
		};

		cb(stores);

		transaction.commit();
	})
}


export { openDB, createStore, runInTransaction }
