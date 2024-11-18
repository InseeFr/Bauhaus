import { OperationsApi } from '@sdk/operations-api';

import { Rubric } from '../../../../../model/Sims';
import { flattenTree } from '../../../../utils/msd';
import { CREATE, DUPLICATE, HELP, UPDATE, VIEW } from '../../../constant';
import { removeRubricsWhenDuplicate } from '../../../utils';

export type MsdMode =
	| typeof HELP
	| typeof CREATE
	| typeof VIEW
	| typeof UPDATE
	| typeof DUPLICATE;

export const getDefaultSims = (
	mode: MsdMode,
	rubrics: Rubric[],
	metadataStructure: any,
): Record<string, Rubric> => {
	const flattenStructure = flattenTree(metadataStructure);

	return {
		...Object.keys(flattenStructure).reduce((acc, key) => {
			return {
				...acc,
				[key]: {
					rangeType: flattenStructure[key].rangeType,
					idAttribute: key,
					value: '',
					labelLg1: '',
					labelLg2: '',
				},
			};
		}, {}),
		...removeRubricsWhenDuplicate(mode, rubrics),
	};
};

export const getSiblingSims = (
	id: string,
	metadataStructure: any,
): Promise<Record<string, Rubric>> => {
	return OperationsApi.getSims(id).then((result: any) => {
		return getDefaultSims(
			DUPLICATE,
			result.rubrics.reduce((acc: Record<string, Rubric>, rubric: Rubric) => {
				return {
					...acc,
					[rubric.idAttribute]: rubric,
				};
			}, {}),
			metadataStructure,
		);
	});
};
