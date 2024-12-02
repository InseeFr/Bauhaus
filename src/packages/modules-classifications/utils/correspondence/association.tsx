import { buildEmpty } from '@utils/build-general-proptypes';

export const fieldsWithRequired = [
	['correspondenceId', true],
	['associationId', true],
	['labelLg1', true],
	['labelLg2', false],
	['scopeNoteLg1', false],
	['scopeNoteLg2', false],
	['sourceClassId', true],
	['sourceClassAltLabelLg1', false],
	['sourceClassAltLabelLg2', false],
	['targetClassId', true],
	['targetClassAltLabelLg1', false],
	['targetClassAltLabelLg2', false],
	['sourceItemId', true],
	['sourceItemLabelLg1', true],
	['sourceItemLabelLg2', false],
	['targetItemId', true],
	['targetItemLabelLg1', true],
	['targetItemLabelLg2', false],
];

export const empty = () => buildEmpty(fieldsWithRequired);
