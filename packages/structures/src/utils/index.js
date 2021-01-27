import React from 'react';
import D from '../i18n/build-dictionary';
import {
	MUTUALIZED_COMPONENT_TYPES,
	ATTACHMENTS,
	MEASURE_PROPERTY_TYPE,
} from './constants/';

export const getDisseminationStatus = disseminationStatus => {
	if(!disseminationStatus){
		return '';
	}
	if(disseminationStatus.indexOf('PublicGenerique') > 0){
		return D.DSPublicGeneriqueTitle;
	} else if(disseminationStatus.indexOf('PublicSpecifique') > 0){
		return D.DSPublicSpecifiqueTitle;
	} else if(disseminationStatus.indexOf('Prive') > 0){
		return D.DSPrivateTitle;
	}
}

export const getAllAttachment = components => {
	return [
		...ATTACHMENTS,
		...components
			.filter(c => c.component.type === MEASURE_PROPERTY_TYPE)
			.map(c => ({ value: c.component.id, label: c.component.labelLg1 })),
	];
};
export const formatLabel = component => {
	return (
		<React.Fragment>
			{component.labelLg1}
			<span className="badge badge-pill" style={{ marginLeft: '1em' }}>
				{
					MUTUALIZED_COMPONENT_TYPES.find(c => c.value === component.type)
						?.label
				}
			</span>
		</React.Fragment>
	);
};
export const typeUriToLabel = (uri = '') => {
	return MUTUALIZED_COMPONENT_TYPES.find(component => component.value === uri)
		?.label;
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
		dataField: 'mutualized',
		text: D.mutualized,
		width: '10%',
	},
	{
		dataField: 'concept',
		text: D.conceptTitle,
		width: '20%',
	},
	{
		dataField: 'codeList',
		text: D.representationTitle,
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
		type: 'errorsTypeMandatory',
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
