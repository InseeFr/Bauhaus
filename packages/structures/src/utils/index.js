import D from '../i18n/build-dictionary';

export const typeUriToLabel = (uri = '') => {
	const key = uri.substr(uri.indexOf('#') + 1);
	return D[key + 'Title'];
};

export const defaultComponentsTableParams = [
	{
		dataField: 'labelLg1',
		text: D.label,
		width: '20%',
		isKey: true,
	},
	{
		dataField: 'type',
		text: D.type,
		width: '20%',
	},
	{
		dataField: 'concept',
		text: D.conceptTitle,
		width: '20%',
	},
	{
		dataField: 'codeList',
		text: D.codesListTitle,
		width: '20%',
	},
	{
		dataField: 'actions',
		text: '',
		width: '20%',
	},
];

export const validateComponent = component => {
	if (!component.id) {
		return {
			field: 'id',
			message: D.errorsIdMantory,
		};
	}
	if (!component.labelLg1) {
		return {
			field: 'labelLg1',
			message: D.errorsLabelLg1Mandatory,
		};
	}
	return {};
};
