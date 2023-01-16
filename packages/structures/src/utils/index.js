import React from 'react';
import D, {D1, D2} from '../i18n/build-dictionary';
import {
	MUTUALIZED_COMPONENT_TYPES,
	ATTACHMENTS,
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

export const getAllAttachment = (measures, specification) => {
	const measuresOptions = measures.map(c => ({ value: c.id, label: c.labelLg1 }));

	// We find one measure linked to the attribute
	const measureWithThisAttribute = measures.find(measure => {
		return !!Object.keys(measure).filter(key => key.indexOf("attribute_") === 0).find(key => {
			return measure[key] === specification.component.iri;
		})
	})

	// If this measure exists, this attribute can only have a measure as an attachment
	if(!!measureWithThisAttribute){
		return measuresOptions;
	}

	return [
		...ATTACHMENTS,
		...measuresOptions,
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
		dataField: 'representation',
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
	const errors = [];

	if(!component.identifiant){
		errors.push(D.mandatoryProperty(D.idTitle));
	}
	if(!component.labelLg1){
		errors.push(D.mandatoryProperty(D1.label));
	}
	if(!component.labelLg2){
		errors.push(D.mandatoryProperty(D2.label));
	}
	if(!component.type){
		errors.push(D.mandatoryProperty(D1.type));
	}

	return {
		errors
	};
};
