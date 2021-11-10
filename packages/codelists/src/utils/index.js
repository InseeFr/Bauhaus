import React from 'react';
import { getTreeFromFlatData, getFlatDataFromTree } from 'react-sortable-tree';
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

const treeElement = (n, i) => {
	if (n.parents?.length > 0) {
		return n.parents.map((p) => {
			return {
				code: n.code,
				title: n.code + ' - ' + n.labelLg1,
				label: n.labelLg1,
				parent: p.parent,
				position: p.position,
			};
		});
	}
	return {
		code: n.code,
		title: n.code + ' - ' + n.labelLg1,
		label: n.labelLg1,
		parent: '',
		position: n.position ? n.position[0] : i + 1,
	};
};

export const treedData = (arrayData) => {
	if (arrayData.length === 0) return [];
	return getTreeFromFlatData({
		flatData: arrayData.map((n, i) => treeElement(n, i)).flat(),
		getKey: (node) => node.code,
		getParentKey: (node) => node.parent,
		rootKey: '',
	});
};

export const recalculatePositions = (codes, tree) => {
	const flattenTree = getFlatDataFromTree({
		treeData: tree,
		getNodeKey: ({ node }) => node.code,
		ignoreCollapsed: false,
	});
	return codes?.map((c) => ({
		...c,
		parents: flattenTree
			.filter((treedCode) => treedCode.node.code === c.code)
			.map((treedCode) => ({
				parent: treedCode.parentNode ? treedCode.parentNode.code : '',
				position: treedCode.treeIndex + 1,
			})),
	}));
};

const superiorToParent = (child, parent) => {
	return child > parent;
};

const getPosition = (codes, parentName, childPositions) => {
	const parentPositions = codes.map(
		([key, value]) => key === parentName && value.positions
	);
	return {
		parent: parentName,
		position: Math.min(
			...childPositions.filter((childPos) =>
				superiorToParent(childPos, parentPositions[0])
			)
		),
	};
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
						parents:
							c.parents && c.parents[0]
								? c.parents.map((p) =>
										getPosition(
											Object.entries(cl.codes),
											p,
											/* Object.values(Object.values(c.code).positions) */
											c.positions || [i + 1]
										)
								  )
								: [
										{
											parent: '',
											position: c.positions ? c.positions[0] : i + 1,
										},
								  ],
					},
				};
			}, {});
	}
	return cl;
};
