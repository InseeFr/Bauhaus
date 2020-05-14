import { QB } from './prefixes';
import D from '../../i18n/build-dictionary';

export const MEASURE_TYPE = `${QB}measure`;
export const DIMENSION_TYPE = `${QB}dimension`;
export const ATTRIBUTE_TYPE = `${QB}attribute`;

export const COMPONENT_TYPES = [
	{ value: ATTRIBUTE_TYPE, label: D.Attribute },
	{ value: DIMENSION_TYPE, label: D.Dimension },
	{ value: MEASURE_TYPE, label: D.Measure },
];
