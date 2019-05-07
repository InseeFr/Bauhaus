import D from 'js/i18n';
import { getMessageForSecondLang } from 'js/i18n/build-dictionary';
import { isLang2 } from 'js/i18n/build-dictionary';

/**
 * This method is used when we cant to create a new SIMS.
 * It will return a new Object with the labels predefined based
 * on the parent object
 *
 * @param {import('js/types/index').Series | import('js/types/index').Indicator | import('js/types/index').Operation } parent
 * @returns {import('js/types').Sims}
 */
export function getLabelsFromParent(parent, type = 'operation') {
	const labelOperationNameTemplate = '{{PARENT_LABEL}}';
	const key = 'simsLabel_' + type;
	return {
		labelLg1: D[key].replace(labelOperationNameTemplate, parent.prefLabelLg1),
		labelLg2: getMessageForSecondLang(key).replace(
			labelOperationNameTemplate,
			parent.prefLabelLg2
		),
	};
}
/**
 *
 * Take a an array as input, and return a hierarchical tree based on objects
 * @param {Array<Object>} input : the content of a SIMS
 * @param {string} idParent
 * @param {object} objectToMerge
 */
export function getTree(input, idParent, objectToMerge) {
	return input
		.filter(msd => msd.idParent === idParent)
		.sort((msd1, msd2) => {
			const msdId1 = parseInt(msd1.idMas.substr(2).replace('.', ''), 10);
			const msdId2 = parseInt(msd2.idMas.substr(2).replace('.', ''), 10);

			return msdId1 - msdId2;
		})
		.reduce((acc, msd) => {
			const msdToMerge = objectToMerge[msd.idMas] || {};
			return {
				...acc,
				[msd.idMas]: {
					...msd,
					masLabelBasedOnCurrentLang: isLang2()
						? msd.masLabelLg2
						: msd.masLabelLg1,
					isPresentational: msdToMerge.isPresentational || false,
					rangeType: msdToMerge.rangeType,
					codeList: msdToMerge.codeList,
					children: getTree(input, msd.idMas, objectToMerge),
				},
			};
		}, {});
}

/**
 * Flatten a hierarchical tree. Return the same type of data : an object with the
 * ID of the element as a key
 * @param {Object} tree
 */
export function flattenTree(tree) {
	if (!tree) {
		return null;
	}
	return Object.keys(tree).reduce((acc, key) => {
		return {
			...acc,
			[key]: {
				...tree[key],
			},
			...flattenTree(tree[key].children),
		};
	}, {});
}

export const rangeType = {
	REPORTED_ATTRIBUTE: 'REPORTED_ATTRIBUTE',
	TEXT: 'TEXT',
	DATE: 'DATE',
	CODE_LIST: 'CODE_LIST',
	RICH_TEXT: 'RICH_TEXT',
	ORGANIZATION: 'ORGANIZATION',
};
