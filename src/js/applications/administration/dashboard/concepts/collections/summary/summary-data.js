import D from '../../../../../../i18n';

export const rowParams = [
	{
		dataField: 'type',
		text: '',
		width: '66%',
		isKey: true,
	},
	{ dataField: 'total', text: D.totalTitle, width: '34%' },
];

export const buildData = (d) => [
	{
		id: 1,
		type: D.collectionsNumberTitle,
		total: d.length,
	},
	{
		id: 2,
		type: D.provisionalConceptsNumberTitle,
		total: d.filter((c) => c.isValidated === 'false').length,
	},
];
