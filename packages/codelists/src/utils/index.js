import React from 'react';
import { getTreeFromFlatData } from 'react-sortable-tree';
import D, { D1, D2 } from '../i18n/build-dictionary';

export const formatLabel = (component) => {
	return <React.Fragment>{component.labelLg1}</React.Fragment>;
};

export const validateCodelist = (codelist) => {
	const errorMessage = [];
	const fields = {};

	if (!codelist.lastListUriSegment) {
		errorMessage.push(D.mandatoryProperty(D.lastListUriSegmentTitle));
		fields.lastListUriSegment = D.mandatoryProperty(D.lastListUriSegmentTitle);
	}

	if (!codelist.lastCodeUriSegment) {
		errorMessage.push(D.mandatoryProperty(D.lastCodeUriSegmentTitle));
		fields.lastCodeUriSegment = D.mandatoryProperty(D.lastCodeUriSegmentTitle);
	}

	if (!codelist.lastClassUriSegment) {
		errorMessage.push(D.mandatoryProperty(D.lastClassUriSegmentTitle));
		fields.lastClassUriSegment = D.mandatoryProperty(
			D.lastClassUriSegmentTitle
		);
	}

	if (!codelist.id) {
		errorMessage.push(D.mandatoryProperty(D.idTitle));
		fields.id = D.mandatoryProperty(D.idTitle);
	}

	if (!codelist.labelLg1) {
		errorMessage.push(D.mandatoryProperty(D1.labelTitle));
		fields.labelLg1 = D.mandatoryProperty(D1.labelTitle);
	}

	if (!codelist.labelLg2) {
		errorMessage.push(D.mandatoryProperty(D2.labelTitle));
		fields.labelLg2 = D.mandatoryProperty(D2.labelTitle);
	}

	if (!codelist.creator) {
		errorMessage.push(D.mandatoryProperty(D2.creator));
		fields.creator = D.mandatoryProperty(D2.creator);
	}

	if (!codelist.disseminationStatus) {
		errorMessage.push(D.mandatoryProperty(D.disseminationStatusTitle));
		fields.disseminationStatus = D.mandatoryProperty(
			D.disseminationStatusTitle
		);
	}

	return {
		errorMessage,
		fields,
	};
};

export const validatePartialCodelist = (codelist) => {
	const errorMessage = [];
	const fields = {};

	if (!codelist.id) {
		errorMessage.push(D.mandatoryProperty(D.idTitle));
		fields.id = D.mandatoryProperty(D.idTitle);
	} else if (!/^[a-zA-Z0-9_]*$/.test(codelist.id)) {
		errorMessage.push(D.validCharactersProperty(D1.idTitle));
		fields.id = D.validCharactersProperty(D1.idTitle);
	}

	if (!codelist.parentCode) {
		errorMessage.push(D.mandatoryProperty(D.parentCodelist));
		fields.parentCode = D.mandatoryProperty(D.parentCodelist);
	}

	if (!codelist.labelLg1) {
		errorMessage.push(D.mandatoryProperty(D1.labelTitle));
		fields.labelLg1 = D.mandatoryProperty(D1.labelTitle);
	}

	if (!codelist.labelLg2) {
		errorMessage.push(D.mandatoryProperty(D2.labelTitle));
		fields.labelLg2 = D.mandatoryProperty(D2.labelTitle);
	}

	if (!codelist.creator) {
		errorMessage.push(D.mandatoryProperty(D.creator));
		fields.creator = D.mandatoryProperty(D.creator);
	}

	if (!codelist.disseminationStatus) {
		errorMessage.push(D.mandatoryProperty(D.disseminationStatusTitle));
		fields.disseminationStatus = D.mandatoryProperty(
			D.disseminationStatusTitle
		);
	}

	return {
		errorMessage,
		fields,
	};
};

export const validateCode = (code, codes, updateMode) => {
	const errorMessage = [];
	const fields = {};

	if (!code.code) {
		errorMessage.push(D.mandatoryProperty(D.idTitle));
		fields.code = D.mandatoryProperty(D.idTitle);
	}
	if (!code.labelLg1) {
		errorMessage.push(D.mandatoryProperty(D1.labelTitle));
		fields.labelLg1 = D.mandatoryProperty(D1.labelTitle);
	}

	if (!code.labelLg2) {
		errorMessage.push(D.mandatoryProperty(D2.labelTitle));
		fields.labelLg2 = D.mandatoryProperty(D2.labelTitle);
	}

	const doubleCode = !updateMode && codes.find((c) => c.code === code.code);

	if (doubleCode) {
		errorMessage.push(D.ErrorDoubleCode);
		fields.code = D.ErrorDoubleCode;
	}

	return {
		fields,
		errorMessage,
	};
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
	return getTreeFromFlatData({
		flatData: arrayData
			.filter((code) => !!code.code)
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
	const flattenTree = getFlatTree(rootNodes, '');

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
						lastCodeUriSegment: codelist.lastCodeUriSegment,
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
			.reduce((acc, c) => {
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

export const formatPartialCodeList = (cl, parentCl) => {
	if (cl.codes) {
		cl.codes = Object.values(cl.codes)
			.sort((a, b) => (a.code > b.code ? 1 : -1))
			.reduce((acc, c) => {
				return {
					...acc,
					[c.code]: {
						...c,
						id: c.code,
					},
				};
			}, {});
	}
	return {
		...cl,
		parentCode: parentCl.id,
		parentLabel: parentCl.labelLg1,
	};
};

export const partialInGlobalCodes = (parentCL, childCl) => {
	return parentCL
		.sort((a, b) => (a.code > b.code ? 1 : -1))
		.reduce((acc, c) => {
			return [
				...acc,
				{
					...c,
					id: c.code,
					label: c.labelLg1,
					isPartial:
						childCl.filter(
							(partial) =>
								partial.code === c.code && partial.parent === c.parent
						).length > 0,
				},
			];
		}, []);
};
