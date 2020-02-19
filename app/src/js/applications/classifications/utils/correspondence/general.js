import { buildPropTypes, buildEmpty } from '@inseefr/wilco';

export const fieldsWithRequired = [
	['id', true],
	['labelLg1', true],
	['labelLg2', false],
	['descriptionLg1', false],
	['descriptionLg2', false],
	['idFirstClass', true],
	['firstClassLabelLg1', true],
	['firstClassLabelLg2', false],
	['firstAltLabelLg1', false],
	['firstAltLabelLg2', false],
	['idSecondClass', true],
	['secondClassLabelLg1', true],
	['secondClassLabelLg2', false],
	['secondAltLabelLg1', false],
	['secondAltLabelLg2', false],
];

export const propTypes = buildPropTypes(fieldsWithRequired);

export const empty = () => buildEmpty(fieldsWithRequired);
