import React from 'react';
import D from '../i18n/build-dictionary';

export const formatLabel = (component) => {
	return <React.Fragment>{component.labelLg1}</React.Fragment>;
};

export const validateCodelist = (component) => {
	const validations = {
		id: 'errorsIdMandatory',
		labelLg1: 'errorsLabelLg1Mandatory',
		labelLg2: 'errorsLabelLg1Mandatory',
	};

	const field = Object.keys(validations).find((field) => !component[field]);

	if (field) {
		return {
			field,
			message: D[validations[field]],
		};
	}

	return {};
};
