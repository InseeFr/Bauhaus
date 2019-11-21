import { buildPropTypes, buildEmpty } from 'bauhaus-library/src/utils/build-general-proptypes';

export const fieldsWithRequired = [
	['prefLabelLg1', true],
	['prefLabelLg2', false],
	['isValidated', true],
	['conceptVersion', false],
	['altLabels', false],
	['broaderLg1', false],
	['broaderLg2', false],
	['idBroader', false],
];

export const propTypes = buildPropTypes(fieldsWithRequired);

export const empty = () => buildEmpty(fieldsWithRequired);
