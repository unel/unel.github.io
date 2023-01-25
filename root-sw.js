const swName = 'sw/root';

function notify(message, ...args) {
	console.log(`${swName}:: ${message}`, ...args);
}

self.addEventListener('activate', (event) => {
	notify('event fired :: activate', event);
});

self.addEventListener('install', (event) => {
	notify('event fired :: install', event);
});

self.addEventListener('fetch', (event) => {
	notify('event fired :: fetch', event);
});
