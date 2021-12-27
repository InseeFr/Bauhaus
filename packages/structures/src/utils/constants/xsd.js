import D from '../../i18n/build-dictionary';
import { XSD, INSEE, IGEO } from './prefixes';

export const XSD_DATE = `${XSD}date`;
export const XSD_DATE_TIME = `${XSD}dateTime`;
export const XSD_FLOAT = `${XSD}double`;
export const XSD_INT = `${XSD}int`;
export const XSD_STRING = `${XSD}string`;
export const XSD_CODE_LIST = `${INSEE}codeList`;
export const IDEO_TERRITOIRE_STATISTIQUE = `${IGEO}TerritoireStatistique`;

export const XSD_TYPES = [
	{ value: XSD_DATE, label: D.dateType },
	{ value: XSD_DATE_TIME, label: D.dateTimeType },
	{ value: XSD_FLOAT, label: D.floatType },
	{ value: XSD_INT, label: D.intType },
	{ value: XSD_CODE_LIST, label: D.codesListTitle },
	{ value: IDEO_TERRITOIRE_STATISTIQUE, label: D.territoireStatistique },
	{ value: XSD_STRING, label: D.stringType },
];
