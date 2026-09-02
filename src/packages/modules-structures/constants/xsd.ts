import { structuresI18n } from "../i18n";
import { XSD, INSEE, IGEO } from "./prefixes";

export const XSD_DATE = `${XSD}date`;
export const XSD_DATE_TIME = `${XSD}dateTime`;
export const XSD_FLOAT = `${XSD}double`;
export const XSD_INTEGER = `${XSD}integer`;
export const XSD_STRING = `${XSD}string`;
export const XSD_CODE_LIST = `${INSEE}codeList`;
export const IGEO_PAYS_OU_TERRITOIRE = `${IGEO}PaysOuTerritoire`;

export const XSD_TYPES = [
  {
    value: XSD_DATE,
    label: structuresI18n.t("component.representation.date.title"),
  },
  {
    value: XSD_DATE_TIME,
    label: structuresI18n.t("component.representation.dateTime.title"),
  },
  {
    value: XSD_FLOAT,
    label: structuresI18n.t("component.representation.float.title"),
  },
  {
    value: XSD_INTEGER,
    label: structuresI18n.t("component.representation.int.title"),
  },
  {
    value: XSD_CODE_LIST,
    label: structuresI18n.t("component.representation.codelist.title"),
  },
  {
    value: IGEO_PAYS_OU_TERRITOIRE,
    label: structuresI18n.t("component.representation.paysOuTerritoire.title"),
  },
  {
    value: XSD_STRING,
    label: structuresI18n.t("component.representation.string.title"),
  },
] as const;
