function getModulePath(name) {
	return `/js/modules/${name}.js`;
}

function loadModule(name) {
	return import(getModulePath(name));
}

function exposeModule(name) {
	loadModule(name).then(module => Object.assign(window, module))
}

function runModule(name) {
	loadModule(name).then(module => (module.main || module.default)?.())
}

export { getModulePath, loadModule, exposeModule, runModule }
