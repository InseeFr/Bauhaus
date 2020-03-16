export default () => {
	return Promise.resolve({
		abstractLg1: 'description 1',
		prefLabelLg1: "Activité, production et chiffre d'affaires",
		abstractLg2: 'description 2',
		prefLabelLg2: "Activité, production et chiffre d'affaires",
		series: [
			{
				labelLg2: 'Monthly branch surveys',
				labelLg1: 'Enquêtes mensuelles de branche',
				id: 's1006',
			},
			{
				labelLg2: 'Monthly survey of large-scale food retail activities',
				labelLg1:
					"Enquête mensuelle sur l'activité des grandes surfaces alimentaires",
				id: 's1222',
			},
			{
				labelLg2: 'Computation of activity and turnover indices',
				labelLg1:
					"Elaboration des indicateurs d'activité et de chiffre d'affaires",
				id: 's1284',
			},
			{ labelLg2: 'asd', labelLg1: 'sdasd', id: 's1449' },
			{ labelLg2: 'test marine', labelLg1: 'test marine', id: 's1487' },
			{ labelLg2: 'test marine', labelLg1: 'test marine', id: 's1488' },
			{ labelLg2: 'Test Marine 3', labelLg1: 'Test Marine 3', id: 's1489' },
			{ labelLg2: 'blibl', labelLg1: 'blabla', id: 's1511' },
		],
		id: 's82',
		validationState: 'Validated',
	});
};
