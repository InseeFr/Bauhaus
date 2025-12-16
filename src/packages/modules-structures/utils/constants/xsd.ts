import D from "../../i18n/build-dictionary";
import { XSD, INSEE, IGEO } from "./prefixes";

export const XSD_DATE = `${XSD}date`;
export const XSD_DATE_TIME = `${XSD}dateTime`;
export const XSD_FLOAT = `${XSD}double`;
export const XSD_INTEGER = `${XSD}integer`;
export const XSD_STRING = `${XSD}string`;
export const XSD_CODE_LIST = `${INSEE}codeList`;
export const IGEO_PAYS_OU_TERRITOIRE = `${IGEO}PaysOuTerritoire`;

export const XSD_TYPES = [
  { value: XSD_DATE, label: D.dateType },
  { value: XSD_DATE_TIME, label: D.dateTimeType },
  { value: XSD_FLOAT, label: D.floatType },
  { value: XSD_INTEGER, label: D.intType },
  { value: XSD_CODE_LIST, label: D.codesListTitle },
  { value: IGEO_PAYS_OU_TERRITOIRE, label: D.paysOuTerritoire },
  { value: XSD_STRING, label: D.stringType },
] as const;
