import React from 'react';
import D from '../i18n/build-dictionary';
import { COMPONENT_TYPES } from './constants/';
export const formatLabel = component => {
	return (
		<React.Fragment>
			{component.labelLg1}
			<span className="badge badge-pill" style={{ marginLeft: '1em' }}>
				{COMPONENT_TYPES.find(c => c.value === component.type)?.label}
			</span>
		</React.Fragment>
	);
};
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
	const validations = {
		identifiant: 'errorsIdMandatory',
		labelLg1: 'errorsLabelLg1Mandatory',
		labelLg2: 'errorsLabelLg1Mandatory',
	};

	const field = Object.keys(validations).find(field => !component[field]);

	if (field) {
		return {
			field,
			message: D[validations[field]],
		};
	}

	return {};
};
