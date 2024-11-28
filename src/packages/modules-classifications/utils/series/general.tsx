import { buildEmpty } from '@utils/build-general-proptypes';

export const fieldsWithRequired = [
	['id', true],
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
	['familyLg2', false],
	['idFamily', false],
];

export const empty = () => buildEmpty(fieldsWithRequired);
