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

export const MUTUALIZED_COMPONENT_TYPES = [
	{ value: `${QB}AttributeProperty`, label: D.Attribute },
	{ value: `${QB}DimensionProperty`, label: D.Dimension },
	{ value: `${QB}MeasureProperty`, label: D.Measure },
];
