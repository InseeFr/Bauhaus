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
	{ dataField: 'descriptionLg1', text: D1.codeDescription, width: '30%' },
	{ dataField: 'descriptionLg2', text: D2.codeDescription, width: '30%' },
];
