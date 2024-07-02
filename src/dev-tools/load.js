function load (store, callback){
	if (process.env.REACT_APP_DEV_TOOLS_ENABLED === 'true') {
		import('./dev-tools')
			.then(mod => mod.install(store))
			.finally(callback);
	} else {
		callback();
	}
}

export default load;
