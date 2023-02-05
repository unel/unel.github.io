function makePromiseControls() {
	let resolve, reject;

	const promise = new Promise((rs, rj) => {
		resolve = rs;
		reject = rj;
	});

	return { promise, resolve, reject };
}

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


function getKeyRange({ from, to, only }) {
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

function getCursorValue(cursor) {
	return {
		pkey: this._cursor.primaryKey,
		key: this._cursor.key,
		value: this._cursor.value,
	};
}

class StoreCursorAsyncIterator {
	constructor({ store, from, to, only, direction = 'next' }) {
		this._store = store;
		this._keyRange = getKeyRange({ from, to, only });
		this._direction = direction;
	}

	async next() {
		this._currentPromiseControls = makePromiseControls();

		if (!this._request) {
			this._request = this.store.openCursor(this._keyRange, this._direction);
			this._request.onsuccess = this._processCursorSuccess.bind(this);
			this._request.onerror = this._processCursorError.bind(this);
		} else {
			this._currentCursor.continue();
		}

		return this._currentPromiseControls.promise;
	}

	_processCursorSuccess(event) {
		const cursor = event.target.result;

		if (cursor) {
			this._currentPromiseControls.resolve({
				done: false,
				value: getCursorValue(cursor),
			});
		} else {
			this._currentPromiseControls.resolve({
				done: true,
			});
		}

		this._currentCursor = cursor;
	}

	_processCursorError(event) {
		this._currentPromiseControls?.reject(event.target.errorCode);
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
		return new StoreCursorAsyncIterator({ store: this._storeObject, from, to, only, direction });
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
