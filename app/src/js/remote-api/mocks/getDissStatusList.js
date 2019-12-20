export default () => {
	return Promise.resolve([
		{
			label: 'Privé',
			url: 'http://id.insee.fr/codes/base/statutDiffusion/Prive',
		},
		{
			label: 'Public générique',
			url: 'http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique',
		},
		{
			label: 'Public spécifique',
			url: 'http://id.insee.fr/codes/base/statutDiffusion/PublicSpecifique',
		},
	]);
};
