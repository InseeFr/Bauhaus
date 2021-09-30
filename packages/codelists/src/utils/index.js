import React from 'react';
import { getTreeFromFlatData } from 'react-sortable-tree';
import D from '../i18n/build-dictionary';

export const formatLabel = (component) => {
	return <React.Fragment>{component.labelLg1}</React.Fragment>;
};

export const validateCodelist = (codelist) => {
	const validations = {
		id: 'errorsIdMandatory',
		lastListUriSegment: 'lastListUriSegmentMandatory',
		lastClassUriSegment: 'lastClassUriSegmentMandatory',
		labelLg1: 'errorsLabelLg1Mandatory',
		labelLg2: 'errorsLabelLg1Mandatory',
		creator: 'errorsCreatorMandatory',
		disseminationStatus: 'errorsDisseminationStatusMandatory',
	};

	const field = Object.keys(validations).find((field) => !codelist[field]);

	if (field) {
		return {
			field,
			message: D[validations[field]],
		};
	}

	return {};
};

export const validateCode = (code) => {
	const validations = {
		id: 'errorsIdMandatory',
		labelLg1: 'errorsLabelLg1Mandatory',
		labelLg2: 'errorsLabelLg1Mandatory',
	};

	const field = Object.keys(validations).find((field) => !code[field]);

	if (field) {
		return {
			field,
			message: D[validations[field]],
		};
	}

	return {};
};

const treeElement = (n) => {
	if (n.parents) {
		return n.parents.map((p) => ({
			id: n.code,
			title: n.code + ' - ' + n.labelLg1,
			label: n.labelLg1,
			parent: p,
		}));
	}
	return {
		id: n.code,
		title: n.code + ' - ' + n.labelLg1,
		label: n.labelLg1,
		parent: null,
	};
};

export const treedData = (arrayData) => {
	if (arrayData.length === 0) return [];
	return getTreeFromFlatData({
		flatData: arrayData.map((n) => treeElement(n)).flat(),
		getKey: (node) => node.id,
		getParentKey: (node) => node.parent,
		rootKey: null,
	});
};
