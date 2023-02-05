import { openDB, runInTransaction } from '/js/modules/utils/idb.mjs';

const swName = 'sw/root';

// common utils;
function notify(message, ...args) {
	console.log(`${swName}:: ${message}`, ...args);
}

// event listeners
function onActivate(event) {
	notify('event fired :: activate', event);
}

function onInstall(event) {
	notify('event fired :: install', event);
}


const fileUrlRe = new RegExp('/data/(?<id>.+)$');

function onFetch(event) {
	notify('event fired :: fetch', event);

	const { url, method } = event.request;
	if (method !== 'GET' ) {
		notify('event fired :: fetch : skip by method', { method });
		return;
	}

	const match = url.match(fileUrlRe);
	if (!match) {
		notify('event fired :: fetch : skip by match', { url, match });
		return;
	}

	const { id } = match.groups;

	event.respondWith((async () => {
		try {
			const db = await openDB('data', 1, () => {});
			const data = await runInTransaction(db, ['files'], 'readonly', ([store]) => {
				return store.getByKey(Number(id));
			});

			if (!data) {
				notify('event fired :: fetch : skip by data', { data });
				return new Response('no data', {
					status: 404,
				});
			}

			notify('event fired :: fetch : returning response', { data });
			return new Response(data.content, {
				headers: new Headers({
					'Content-Type': data.mimeType
				}),
			});
		} catch (error) {
			notify('event fired :: fetch : error', { error });
		}
	})());
}

function onMessage(event) {
	notify('event fired :: message', event);
}

function onPortMessage(event) {
	notify('event fired :: port message', event);
}

function onConnect(event) {
	notify('event fired:: connect', event);

	for (const port of event.ports) {
		notify('listening port..', port);
		port.addEventListener('message', onPortMessage);
	}
}

function onSync(event) {
	notify('event fired :: sync event', event);
}

// subsctibers
self.addEventListener('activate', onActivate);
self.addEventListener('install', onInstall);
self.addEventListener('fetch', onFetch);
self.addEventListener('connect', onConnect);
self.addEventListener('message', onMessage);
self.addEventListener('sync', onSync);

notify('evaluated', { self });
