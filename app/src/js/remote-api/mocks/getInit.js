export default () => {
	return new Promise(resolve => {
		resolve({
			ok: true,
			json: () =>
				Promise.resolve({
					appHost: 'https://localhost:3000/#/',
					authType: 'NoAuthImpl',
					defaultContributor: 'DG75-L201',
					defaultMailSender:
						'dg75-definitions-et-sources-statistiques@insee.fr',
					lg1: 'fr',
					lg2: 'en',
					maxLengthScopeNote: '350',
				}),
		});
	});
};
