function load(store: unknown, callback: () => void) {
	if (import.meta.env.VITE_DEV_TOOLS_ENABLED === 'true') {
		import('./dev-tools').then((mod) => mod.install(store)).finally(callback);
	} else {
		callback();
	}
}

export default load;
