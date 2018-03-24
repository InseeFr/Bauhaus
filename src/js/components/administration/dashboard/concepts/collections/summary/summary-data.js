import D from 'js/i18n';

export const rowParams = [
	{
		dataField: 'type',
		label: '',
		width: '66%',
		isKey: true,
	},
	{ dataField: 'total', label: D.totalTitle, width: '34%' },
];

export const buildData = d => [
	{
		type: D.collectionsNumberTitle,
		total: d.length,
	},
	{
		type: D.provisionalConceptsNumberTitle,
		total: d.filter(c => c.isValidated === 'Provisoire').length,
	},
];
