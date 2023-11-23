function load(store, configuration, callback) {
	if (configuration.DEV_TOOLS_ENABLED === true) {
		import('./dev-tools')
			.then((mod) => mod.install(store))
			.finally(callback);
	} else {
		callback();
	}
}

export default load;
