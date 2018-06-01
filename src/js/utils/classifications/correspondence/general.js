import { buildPropTypes, buildEmpty } from 'js/utils/build-general-proptypes';

export const fieldsWithRequired = [
	['id', true],
	['labelLg1', true],
	['labelLg2', false],
	['descriptionLg1', false],
	['descriptionLg2', false],
	['idFirstClass', true],
	['firstClasslabelLg1', true],
	['firstClasslabelLg2', false],
	['idSecondClass', true],
	['secondClasslabelLg1', true],
	['secondClasslabelLg2', false],
];

export const propTypes = buildPropTypes(fieldsWithRequired);

export const empty = () => buildEmpty(fieldsWithRequired);
