export default () =>
	Promise.resolve({
		rubrics: [
			{ labelLg2: 'oui ou i', rangeType: 'RICH_TEXT', idAttribute: 'S.3.2' },
			{
				rangeType: 'RICH_TEXT',
				labelLg1: 'Antoine Lafrance',
				idAttribute: 'S.3.1',
			},
			{ rangeType: 'TEXT', labelLg1: 'hello', idAttribute: 'S.1.3' },
		],
		idSeries: '',
		labelLg2: 'Permanent Living Conditions Survey 2008 SIMS',
		labelLg1:
			"SIMS de l'opération Dispositif d'enquêtes permanentes des Conditions de vie 2008",
		idOperation: 's1446',
		idIndicator: '',
		id: '1583',
	});
