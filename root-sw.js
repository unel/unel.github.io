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

// subsctibers
self.addEventListener('activate', onActivate);
self.addEventListener('install', onInstall);
self.addEventListener('fetch', onFetch);

notify('evaluated', { self });
