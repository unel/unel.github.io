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
	loadModule(name).then(exposeObject)
}

function runModule(name) {
	loadModule(name).then(callObject)
}
