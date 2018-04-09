import { buildPropTypes, buildEmpty } from 'js/utils/build-general-proptypes';

export const fieldsWithRequired = [
	['prefLabelLg1', true],
	['prefLabelLg2', false],
	['altLabelLg1', false],
	['altLabelLg2', false],
	['scopeNoteLg1', false],
	['scopeNoteLg2', false],
	['subject', false],
	['publisher', false],
	['covers', false],
	['familyLg1', false],
	['familyLg1', false],
];

export const propTypes = buildPropTypes(fieldsWithRequired);

export const empty = () => buildEmpty(fieldsWithRequired);
