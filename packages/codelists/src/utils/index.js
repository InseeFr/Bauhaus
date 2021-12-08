import React from 'react';
import { getTreeFromFlatData } from 'react-sortable-tree';
import D from '../i18n/build-dictionary';

export const formatLabel = (component) => {
	return <React.Fragment>{component.labelLg1}</React.Fragment>;
};

export const validateCodelist = (codelist) => {
	const validations = {
		//id: 'errorsIdMandatory',
		//lastListUriSegment: 'lastListUriSegmentMandatory',
		//lastClassUriSegment: 'lastClassUriSegmentMandatory',
		//labelLg1: 'errorsLabelLg1Mandatory',
		//labelLg2: 'errorsLabelLg1Mandatory',
		//creator: 'errorsCreatorMandatory',
		//disseminationStatus: 'errorsDisseminationStatusMandatory',
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

const treeElement = (n, i) => {
	if (n.parents?.length > 0) {
		return n.parents.map((p) => {
			return {
				...n,
				title: n.code + ' - ' + n.labelLg1,
				label: n.labelLg1,
				parent: p.code,
				position: p.position,
			};
		});
	}
	return {
		...n,
		title: n.code + ' - ' + n.labelLg1,
		label: n.labelLg1,
		parent: '',
		position: n.position ? n.position[0] : i + 1,
	};
};

export const treedData = (arrayData) => {
	console.log(arrayData)
	return getTreeFromFlatData({
		flatData: arrayData
			.filter(code => !!code.code)
			.map((n, i) => treeElement(n, i))
			.flat()
			.sort((a, b) => (a.position > b.position ? 1 : -1)),
		getKey: (node) => node.code,
		getParentKey: (node) => node.parent,
		rootKey: '',
	});
};

const getFlatTree = (rootNodes, parentNode) => {
	return rootNodes?.reduce((acc, code, i) => {
			if (code.children)
				return [
					...acc,
					{ ...code, parent: parentNode, position: i },
					...getFlatTree(code.children, code.code),
				];
			return [...acc, { ...code, parent: parentNode, position: i }];
		}, []);
};

export const recalculatePositions = (codelist, rootNodes) => {
	const flattenTree = getFlatTree(rootNodes, '')

	return (
		{
			...codelist,
			codes: Object.values(flattenTree).reduce((acc, c) => {
				return {
					...acc,
					[c.code]: {
						...c,
						parents: flattenTree
							.filter((treedCode) => treedCode.code === c.code)
							.map((treedCode) => ({
								code: treedCode.parent,
								position: treedCode.position + 1,
							})),
					},
				};
			}, {}),
		} || {}
	);
};

export const formatCodeList = (cl) => {
	if (cl.codes) {
		cl.codes = Object.values(cl.codes)
			.sort((a, b) => (a.code > b.code ? 1 : -1))
			.reduce((acc, c, i) => {
				return {
					...acc,
					[c.code]: {
						...c,
						id: c.code,
					},
				};
			}, {});
	}
	return cl;
};
