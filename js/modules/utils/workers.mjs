function registerSW(params) {
	return new Promise(async (resolve, reject) => {
		try {
			const { url, scope = '/', notify = ()=>{} } = params;
			const registration = await navigator.serviceWorker.register(url, {
				scope,
			});

			switch (true) {
				case registration.installing:
					notify('installing');
					break;

				case registration.waiting:
					notify('waiting');
					break;

				case registration.active:
					notify('active');
					resolve();
					break;
			}
		} catch (e) {
			reject(e);
		}
	});
}


export { registerSW }
