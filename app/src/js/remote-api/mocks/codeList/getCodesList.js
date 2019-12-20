export default notation => {
	if (notation === 'CL_FREQ') {
		return Promise.resolve({
			codeListLabelLg1: 'Fréquence',
			codes: [
				{
					code: 'B',
					labelLg2: 'Daily \u2013 business week',
					labelLg1: 'Quotidienne \u2013 jours ouvrés',
				},
				{ code: 'Q', labelLg2: 'Quarterly', labelLg1: 'Trimestrielle' },
				{ code: 'L', labelLg2: 'Sub-annual', labelLg1: 'Infra-annuelle' },
				{ code: 'A', labelLg2: 'Annual', labelLg1: 'Annuelle' },
				{ code: 'M', labelLg2: 'Monthly', labelLg1: 'Mensuelle' },
				{
					code: 'S',
					labelLg2: 'Half-yearly, semester',
					labelLg1: 'Semestrielle',
				},
				{
					code: 'P',
					labelLg2: 'Punctual or aperiodic',
					labelLg1: 'Ponctuelle ou apériodique',
				},
				{ code: 'I', labelLg2: 'Biennial', labelLg1: 'Bisannuelle' },
				{ code: 'N', labelLg2: 'Minutely', labelLg1: 'Toutes les minutes' },
				{ code: 'C', labelLg2: 'Continuous', labelLg1: 'Continue' },
				{ code: 'T', labelLg2: 'Bimonthly', labelLg1: 'Bimestrielle' },
				{ code: 'W', labelLg2: 'Weekly', labelLg1: 'Hebdomadaire' },
				{ code: 'D', labelLg2: 'Daily', labelLg1: 'Quotidienne' },
				{ code: 'H', labelLg2: 'Hourly', labelLg1: 'Toutes les heures' },
				{ code: 'U', labelLg2: 'Multiannual', labelLg1: 'Pluriannuelle' },
			],
			codeListLabelLg2: 'Frequency',
			notation: 'CL_FREQ',
		});
	}
	return Promise.resolve({
		codeListLabelLg1: 'Catégorie de source',
		codes: [
			{ code: 'M', labelLg2: 'Modelization', labelLg1: 'Modélisation' },
			{ code: 'S', labelLg2: 'Survey', labelLg1: 'Enquête' },
			{
				code: 'A',
				labelLg2: 'Administrative data',
				labelLg1: 'Données administratives',
			},
			{ code: 'I', labelLg2: 'Indicators', labelLg1: 'Indicateurs' },
			{ code: 'R', labelLg2: 'Register', labelLg1: 'Répertoire' },
			{ code: 'P', labelLg2: 'Panel', labelLg1: 'Panel' },
			{ code: 'C', labelLg2: 'Synthesis', labelLg1: 'Synthèse' },
		],
		codeListLabelLg2: 'Source category',
		notation: 'CL_SOURCE_CATEGORY',
	});
};
