const Module = (() => {
	function getModulePath(name) {
		return `/js/modules/${name}.mjs`;
	}

	function loadModule(name) {
		return import(getModulePath(name));
	}

	function exposeObject(object) {
		Object.assign(window, object);
	}

	function callObject(module) {
		return (module.main || module.default)?.();
	}


	function exposeModule(name) {
		return loadModule(name).then(exposeObject);
	}

	function runModule(name) {
		return loadModule(name).then(callObject);
	}

	const EXPERIMENTS = [
		'e00-sw',
		'e01-grid',
		'e02-indexed-db',
	];

	function runExperiment(idx) {
		runModule(EXPERIMENTS[idx]);
	}

	return {
		getPath: getModulePath,
		expose: exposeModule,
		run: runModule,
		runExperiment,
	};
})()
