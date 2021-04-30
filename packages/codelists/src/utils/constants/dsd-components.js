import { QB } from './prefixes';
import D from '../../i18n/build-dictionary';

const ATTRIBUTE_PROPERTY_TYPE = `${QB}AttributeProperty`;
const MEASURE_PROPERTY_TYPE = `${QB}MeasureProperty`;
const DIMENSION_PROPERTY_TYPE = `${QB}DimensionProperty`;

export const MUTUALIZED_COMPONENT_TYPES = [
	{
		value: ATTRIBUTE_PROPERTY_TYPE,
		label: D.Attribute,
		labelPlural: D.AttributePlural,
	},
	{
		value: DIMENSION_PROPERTY_TYPE,
		label: D.Dimension,
		labelPlural: D.DimensionPlural,
	},
	{
		value: MEASURE_PROPERTY_TYPE,
		label: D.Measure,
		labelPlural: D.MeasurePlural,
	},
];
