import { QB } from './prefixes';

export const MEASURE_TYPE = `${QB}measure`;
export const DIMENSION_TYPE = `${QB}dimension`;
export const ATTRIBUTE_TYPE = `${QB}attribute`;

export const COMPONENT_TYPES = [
  { value: ATTRIBUTE_TYPE, label: 'Attribute' },
  { value: DIMENSION_TYPE, label: 'Dimension' },
  { value: MEASURE_TYPE, label: 'Measure' },
];
