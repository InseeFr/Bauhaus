import D from 'js/i18n';
import { XSD } from './prefixes';

export const XSD_DATE = `${XSD}date`;
export const XSD_FLOAT = `${XSD}float`;
export const XSD_INT = `${XSD}int`;
export const XSD_STRING = `${XSD}string`;

export const XSD_TYPES = [
  { value: XSD_DATE, label: D.dateType },
  { value: XSD_FLOAT, label: D.floatType },
  { value: XSD_INT, label: D.intType },
  { value: XSD_STRING, label: D.stringType },
];
