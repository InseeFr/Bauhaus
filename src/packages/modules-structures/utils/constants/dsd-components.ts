import D from '../../i18n/build-dictionary';
import { QB } from './prefixes';

export const MEASURE_TYPE = `${QB}measure`;
export const DIMENSION_TYPE = `${QB}dimension`;
export const ATTRIBUTE_TYPE = `${QB}attribute`;

export const COMPONENT_TYPES = [
	{ value: ATTRIBUTE_TYPE, label: D.Attribute },
	{ value: DIMENSION_TYPE, label: D.Dimension },
	{ value: MEASURE_TYPE, label: D.Measure },
];

export const ATTRIBUTE_PROPERTY_TYPE = `${QB}AttributeProperty`;
export const MEASURE_PROPERTY_TYPE = `${QB}MeasureProperty`;
export const DIMENSION_PROPERTY_TYPE = `${QB}DimensionProperty`;

export const MUTUALIZED_COMPONENT_TYPES = [
	{
		value: ATTRIBUTE_PROPERTY_TYPE,
		label: D.Attribute,
		labelPlural: D.AttributePlural,
	},
	{
		value: `${QB}DimensionProperty`,
		label: D.Dimension,
		labelPlural: D.DimensionPlural,
	},
	{
		value: MEASURE_PROPERTY_TYPE,
		label: D.Measure,
		labelPlural: D.MeasurePlural,
	},
];

export const DISSEMINATION_STATUS = {
	PUBLIC_GENERIC:
		'http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique',
};
