import { buildPropTypes, buildEmpty } from '@inseefr/ui/src/utils/build-general-proptypes';

export const fieldsWithRequired = [['prefLabelLg1', true]];

export const propTypes = buildPropTypes(fieldsWithRequired);

export const empty = () => buildEmpty(fieldsWithRequired);
