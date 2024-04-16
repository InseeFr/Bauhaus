import { D1, D2 } from '../../i18n/build-dictionary';

export const rowParams = [
	{
		dataField: 'code',
		text: D1.codeTitle,
		width: '8%',
		isKey: true,
	},
	{ dataField: 'labelLg1', text: D1.codeLabel, width: '16%' },
	{ dataField: 'labelLg2', text: D2.codeLabel, width: '16%' },
	{ dataField: 'broader', text: D1.codelistBroader, width: '30%' },
	{ dataField: 'narrower', text: D1.codelistNarrower, width: '30%' },
	{ dataField: 'closeMatch', text: D1.codelistCloseMatch, width: '30%' },
	{
		dataField: 'actions',
		text: '',
		width: '20%',
	},
];
