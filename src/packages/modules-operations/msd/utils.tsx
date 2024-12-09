import { editorStateFromMd } from '@utils/html-utils';

import { MetadataStructure, Rubric, Sims } from '../../model/Sims';
import { rangeType } from '../utils/msd';
import { DUPLICATE, Mode } from './constant';

const { RICH_TEXT, TEXT, ORGANIZATION, DATE, GEOGRAPHY, CODE_LIST } = rangeType;

export const HELP_COLLAPSED = 'HELP_COLLAPSED';

export function isOpen(id: string) {
	const collapsed = JSON.parse(localStorage.getItem(HELP_COLLAPSED) || '{}');
	return collapsed[id] || false;
}

export function toggleOpen(id: string) {
	const collapsed = JSON.parse(localStorage.getItem(HELP_COLLAPSED) || '{}');
	const previous = collapsed[id] || false;
	localStorage.setItem(
		HELP_COLLAPSED,
		JSON.stringify({
			...collapsed,
			[id]: !previous,
		}),
	);
}

/**
 * Return true if the section of a MSD should display its labelLg2
 */
export function hasLabelLg2(section: Rubric) {
	const sectionsWhichDisplayLg2 = [
		TEXT,
		RICH_TEXT,
		ORGANIZATION,
		DATE,
		GEOGRAPHY,
		CODE_LIST,
	];
	return sectionsWhichDisplayLg2.includes(section.rangeType);
}

export function getParentUri(sims: Sims) {
	if (sims.idOperation) {
		return `/operations/operation/${sims.idOperation}`;
	} else if (sims.idSeries) {
		return `/operations/series/${sims.idSeries}`;
	} else if (sims.idIndicator) {
		return `/operations/indicator/${sims.idIndicator}`;
	}
}

export const getParentType = (
	sims: Sims,
): 'operation' | 'series' | 'indicator' | undefined => {
	if (sims.idOperation) {
		return 'operation';
	}
	if (sims.idSeries) {
		return 'series';
	}
	if (sims.idIndicator) {
		return 'indicator';
	}
};

export function getParentId(sims: Sims) {
	return sims.idOperation || sims.idSeries || sims.idIndicator;
}

export function getParentIdName(
	parentType: 'operation' | 'series' | 'indicator',
) {
	if (parentType === 'operation') {
		return 'idOperation';
	}
	if (parentType === 'series') {
		return 'idSeries';
	}
	if (parentType === 'indicator') {
		return 'idIndicator';
	}
}

export function removeRubricsWhenDuplicate(
	mode: Mode,
	rubrics: Record<string, Rubric> = {},
) {
	/**
	 * @type {string[]} name A name to use.
	 */
	const blackList = ['I.6.4'];

	return Object.keys(rubrics).reduce((acc, rubricKey) => {
		if (mode === DUPLICATE && blackList.indexOf(rubricKey) >= 0) return acc;
		return {
			...acc,
			[rubricKey]: {
				...rubrics[rubricKey],
				labelLg1:
					rubrics[rubricKey].rangeType === 'RICH_TEXT'
						? editorStateFromMd(rubrics[rubricKey].labelLg1)
						: rubrics[rubricKey].labelLg1,
				labelLg2:
					rubrics[rubricKey].rangeType === 'RICH_TEXT'
						? editorStateFromMd(rubrics[rubricKey].labelLg2)
						: rubrics[rubricKey].labelLg2,
			},
		};
	}, {});
}

export function shouldDisplayTitleForPrimaryItem(msd: MetadataStructure) {
	return (
		msd.isPresentational ||
		(!msd.isPresentational && Object.keys(msd.children).length === 0)
	);
}
