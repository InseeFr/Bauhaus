export const rowParams = [
	{
		dataField: 'type',
		label: '',
		width: '66%',
		isKey: true,
	},
	{ dataField: 'total', label: 'Total', width: '34%' },
];

export const buildData = d => [
	{
		type: 'Nombre de collections',
		total: d.length,
	},
	{
		type: 'dont « provisoires »',
		total: d.filter(c => c.isValidated === 'Provisoire').length,
	},
];
