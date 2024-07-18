import { getTreeFromFlatData } from 'react-sortable-tree';
import D, { D1, D2 } from '../i18n/build-dictionary';
import MainDictionary from '../../../i18n/build-dictionary';
import { z } from 'zod';
import { formatValidation } from '../../../new-architecture/utils/validation';

export const formatLabel = (component) => {
	return <>{component.labelLg1}</>;
};

const CodesList = z.object({
	lastListUriSegment: z
		.string({
			required_error: D.mandatoryProperty(D.lastListUriSegmentTitle),
		})
		.trim()
		.min(1, { message: D.mandatoryProperty(D.lastListUriSegmentTitle) }),
	lastCodeUriSegment: z
		.string({
			required_error: D.mandatoryProperty(D.lastCodeUriSegmentTitle),
		})
		.trim()
		.min(1, { message: D.mandatoryProperty(D.lastCodeUriSegmentTitle) }),
	lastClassUriSegment: z
		.string({
			required_error: D.mandatoryProperty(D.lastClassUriSegmentTitle),
		})
		.trim()
		.min(1, { message: D.mandatoryProperty(D.lastClassUriSegmentTitle) }),
	id: z
		.string({ required_error: D.mandatoryProperty(D.idTitle) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D.idTitle) }),
	labelLg1: z
		.string({ required_error: D.mandatoryProperty(D1.labelTitle) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D1.labelTitle) }),
	labelLg2: z
		.string({ required_error: D.mandatoryProperty(D2.labelTitle) })
		.trim()
		.min(1, { message: D.mandatoryProperty(D2.labelTitle) }),
	creator: z
		.string({ required_error: D.mandatoryProperty(D.creator) })
		.min(1, { message: D.mandatoryProperty(D.creator) }),
	disseminationStatus: z
		.string({
			required_error: D.mandatoryProperty(
				MainDictionary.disseminationStatusTitle
			),
		})
		.min(1, {
			message: D.mandatoryProperty(MainDictionary.disseminationStatusTitle),
		}),
});
export const validateCodelist = (codelist) =>
	formatValidation(CodesList)(codelist);

const PartialCodesList = z.object({
	id: z
		.string({
			required_error: D.mandatoryProperty(D.idTitle),
		})
		.trim()
		.min(1, { message: D.mandatoryProperty(D.idTitle) })
		.regex(/^[a-zA-Z0-9_]*$/, D.validCharactersProperty(D1.idTitle)),
	parentCode: z
		.string({
			required_error: D.mandatoryProperty(D.parentCodelist),
		})
		.min(1, { message: D.mandatoryProperty(D.parentCodelist) }),
	labelLg1: z
		.string({
			required_error: D.mandatoryProperty(D1.labelTitle),
		})
		.trim()
		.min(1, { message: D.mandatoryProperty(D1.labelTitle) }),
	labelLg2: z
		.string({
			required_error: D.mandatoryProperty(D2.labelTitle),
		})
		.trim()
		.min(1, { message: D.mandatoryProperty(D2.labelTitle) }),
	creator: z
		.string({
			required_error: D.mandatoryProperty(D.creator),
		})
		.min(1, { message: D.mandatoryProperty(D.creator) }),
	disseminationStatus: z
		.string({
			required_error: D.mandatoryProperty(
				MainDictionary.disseminationStatusTitle
			),
		})
		.min(1, {
			message: D.mandatoryProperty(MainDictionary.disseminationStatusTitle),
		}),
});
export const validatePartialCodelist = (codelist) =>
	formatValidation(PartialCodesList)(codelist);

const Code = (shouldCheckDuplicate, codes) =>
	z.object({
		code: z
			.string({ required_error: D.mandatoryProperty(D.idTitle) })
			.trim()
			.min(1, { message: D.mandatoryProperty(D.idTitle) })
			.refine(
				(value) => {
					return !shouldCheckDuplicate || !codes.find((c) => c.code === value);
				},
				{
					message: D.ErrorDoubleCode,
				}
			),
		labelLg1: z
			.string({ required_error: D.mandatoryProperty(D1.labelTitle) })
			.trim()
			.min(1, { message: D.mandatoryProperty(D1.labelTitle) }),
		labelLg2: z
			.string({ required_error: D.mandatoryProperty(D2.labelTitle) })
			.trim()
			.min(1, { message: D.mandatoryProperty(D2.labelTitle) }),
	});

export const validateCode = (code, codes, updateMode) => {
	return formatValidation(Code(!updateMode, codes))(code);
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
