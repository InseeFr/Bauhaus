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

export const validateCode = (code, codes, updateMode) => {
	const validations = {
		code: 'errorsIdMandatory',
		labelLg1: 'errorsLabelLg1Mandatory',
		labelLg2: 'errorsLabelLg1Mandatory',
	};

	const emptyField = Object.keys(validations).find((field) => !code[field]);

	if (emptyField) {
		return {
			emptyField,
			message: D[validations[emptyField]],
		};
	}

	const doubleCode = !updateMode && codes.find((c) => c.code === code.code);

	if (doubleCode) {
		return {
			doubleCode,
			message: D.ErrorDoubleCode,
		};
	}

	return {};
};

const treeElement = (n) => {
	if (n.parents?.length > 0) {
		return n.parents.map((p) => ({
			code: n.code,
			title: n.code + ' - ' + n.labelLg1,
			label: n.labelLg1,
			parent: p,
		}));
	}
	return {
		code: n.code,
		title: n.code + ' - ' + n.labelLg1,
		label: n.labelLg1,
		parent: null,
	};
};

export const treedData = (arrayData) => {
	if (arrayData.length === 0) return [];
	return getTreeFromFlatData({
		flatData: arrayData.map((n) => treeElement(n)).flat(),
		getKey: (node) => node.code,
		getParentKey: (node) => node.parent,
		rootKey: null,
	});
};
