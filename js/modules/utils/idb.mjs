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

function callRequest(target, method, ...args) {
	return new Promise((resolve, reject) => {
		console.log(`request ${method}`, args);
		const request = target[method](...args);

		request.onerror = (event) => {
			console.log(`request ${method} error`, { request, event });
			return reject(event);
		};

		request.onsuccess = (event) => {
			console.log(`request ${method} success`, { request, event })
			return resolve(event.target.result);
		};
	});
}

class StoreCursorAsyncIterator {
	constructor({ cursor }) {
		this._cursor = cursor;
	}

	getCurrentValue() {
		if (!this._cursor) {
			return undefined;
		}

		return {
			pkey: this._cursor.primaryKey,
			key: this._cursor.key,
			value: this._cursor.value,
		}
	}

	async next() {
		if (this._cursor) {
			const result = {
				done: false,
				value: this.getCurrentValue(),
			};

			this._cursor = await callRequest(this._cursor, 'continue');
			return result;
		}

		return {
			done: true,
		};
	}

	[Symbol.asyncIterator]() {
		return this;
	}
}

class Store {
	constructor(storeObject) {
		this._storeObject = storeObject;
		this._requestPromises = [];
	}

	getByKey(key) {
		return this._makeAndKeepRequest('get', key);
	}

	getAll() {
		return this._makeAndKeepRequest('getAll');
	}

	getAllKeys() {
		return this._makeAndKeepRequest('getAllKeys');
	}

	async getCursor({ from, to, only, direction = 'next' } = {}) {
		const range = this._getKeyRange({ from, to, only });
		const cursor = await this._makeAndKeepRequest('openCursor', range, direction);

		return new StoreCursorAsyncIterator({ cursor });
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

	awaitAllRequests() {
		return Promise.all(this._requestPromises);
	}

	_getKeyRange({ from, to, only }) {
		let range = null;

		if (only) {
			range = IDBKeyRange.only(only);
		} else if (from && to) {
			range = IDBKeyRange.bound(from, to);
		} else if (from) {
			range = IDBKeyRange.lowerBound(from);
		} else if (to) {
			range = IDBKeyRange.upperBound(to);
		}

		return range;
	}

	_makeAndKeepRequest(method, ...args) {
		const requestPromise = callRequest(this._storeObject, method, ...args);

		this._requestPromises.push(requestPromise);

		return requestPromise;
	}
}

function runInTransaction(db, storeNames, mode, fn) {
	return new Promise(async (resolve, reject) => {
		const transaction = db.transaction(storeNames, mode);
		const stores = storeNames.map(storeName => new Store(transaction.objectStore(storeName)))

		const result = await fn(stores);
		transaction.commit();

		try {
			await Promise.all(stores.map(store => store.awaitAllRequests()));
			return resolve(result);

		} catch (e) {
			return reject(e);
		}
	})
}


export { openDB, createStore, runInTransaction }
