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

function onFetch(event) {
	notify('event fired :: fetch', event);
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
