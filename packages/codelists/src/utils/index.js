import React from 'react';
import { getTreeFromFlatData } from 'react-sortable-tree';
import D from '../i18n/build-dictionary';

export const formatLabel = (component) => {
	return <React.Fragment>{component.labelLg1}</React.Fragment>;
};

export const validateCodelist = (component) => {
	const validations = {
		id: 'errorsIdMandatory',
		lastListUriSegment: 'lastListUriSegmentMandatory',
		lastClassUriSegment: 'lastClassUriSegmentMandatory',
		labelLg1: 'errorsLabelLg1Mandatory',
		labelLg2: 'errorsLabelLg1Mandatory',
		creator: 'errorsCreatorMandatory',
		disseminationStatus: 'errorsDisseminationStatusMandatory',
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

export const treedData = (arrayData) => {
	return (
		/* (arrayData.length !== 0 && */
		getTreeFromFlatData({
			flatData: arrayData.map((n) => ({
				id: n.code,
				//title: '',
				label: n.labelLg1,
				parent: n.parents ? n.parents[0] : 'root',
			})),
			getKey: (node) => node.id,
			getParentKey: (node) => node.parent,
			rootKey: 'root',
		})
		/* 			) ||
		[] */
	);
};
