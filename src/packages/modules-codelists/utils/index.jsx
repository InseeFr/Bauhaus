import { z } from 'zod';

import {
	formatValidation,
	mandatoryAndNotEmptySelectField,
	mandatoryAndNotEmptyTextField,
} from '@utils/validation';

import MainDictionary from '../../deprecated-locales/build-dictionary';
import D, { D1, D2 } from '../i18n/build-dictionary';

export const formatLabel = (component) => {
	return <>{component.labelLg1}</>;
};

const ZodCodeList = z.object({
	lastListUriSegment: mandatoryAndNotEmptyTextField(
		D.lastListUriSegmentTitleShort,
	),
	lastCodeUriSegment: mandatoryAndNotEmptyTextField(
		D.lastCodeUriSegmentTitleShort,
	),
	lastClassUriSegment: mandatoryAndNotEmptyTextField(
		D.lastClassUriSegmentTitleShort,
	),
	id: mandatoryAndNotEmptyTextField(D.idTitle),
	labelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle),
	labelLg2: mandatoryAndNotEmptyTextField(D2.labelTitle),
	creator: mandatoryAndNotEmptySelectField(D.creator),
	disseminationStatus: mandatoryAndNotEmptySelectField(
		MainDictionary.disseminationStatusTitle,
	),
});

export const validateCodelist = (codelist) =>
	formatValidation(ZodCodeList)(codelist);

const ZodPartialCodeList = z.object({
	id: mandatoryAndNotEmptyTextField(D.idTitle).regex(
		/^\w*$/,
		D.validCharactersProperty(D.idTitle),
	),
	parentCode: mandatoryAndNotEmptySelectField(D.parentCodelist),
	labelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle),
	labelLg2: mandatoryAndNotEmptyTextField(D2.labelTitle),
	creator: mandatoryAndNotEmptySelectField(D.creator),
	disseminationStatus: mandatoryAndNotEmptySelectField(
		MainDictionary.disseminationStatusTitle,
	),
});

export const validatePartialCodelist = (codelist) =>
	formatValidation(ZodPartialCodeList)(codelist);

const Code = (shouldCheckDuplicate, codes) =>
	z.object({
		code: mandatoryAndNotEmptyTextField(D.idTitle).refine(
			(value) => !shouldCheckDuplicate || !codes.find((c) => c.code === value),
			{
				message: D.ErrorDoubleCode,
			},
		),
		labelLg1: mandatoryAndNotEmptyTextField(D1.labelTitle),
		labelLg2: mandatoryAndNotEmptyTextField(D2.labelTitle),
	});

export const validateCode = (code, codes, updateMode) => {
	return formatValidation(Code(!updateMode, codes))(code);
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

	return {
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
	};
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
								partial.code === c.code && partial.parent === c.parent,
						).length > 0,
				},
			];
		}, []);
};
