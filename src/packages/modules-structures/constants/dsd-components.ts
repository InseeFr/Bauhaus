import structuresI18n from "../i18n";

import { QB } from "./prefixes";

export const MEASURE_TYPE = `${QB}measure`;
export const DIMENSION_TYPE = `${QB}dimension`;
export const ATTRIBUTE_TYPE = `${QB}attribute`;

export const COMPONENT_TYPES = [
  {
    value: ATTRIBUTE_TYPE,
    label: structuresI18n.t("component.type.attribute.title"),
  },
  {
    value: DIMENSION_TYPE,
    label: structuresI18n.t("component.type.dimension.title"),
  },
  {
    value: MEASURE_TYPE,
    label: structuresI18n.t("component.type.measure.title"),
  },
];

export const ATTRIBUTE_PROPERTY_TYPE = `${QB}AttributeProperty`;
export const MEASURE_PROPERTY_TYPE = `${QB}MeasureProperty`;
export const DIMENSION_PROPERTY_TYPE = `${QB}DimensionProperty`;

export const MUTUALIZED_COMPONENT_TYPES = [
  {
    value: ATTRIBUTE_PROPERTY_TYPE,
    label: structuresI18n.t("component.type.attribute.title"),
    labelPlural: structuresI18n.t("component.type.attribute.pluralTitle"),
  },
  {
    value: `${QB}DimensionProperty`,
    label: structuresI18n.t("component.type.dimension.title"),
    labelPlural: structuresI18n.t("component.type.dimension.pluralTitle"),
  },
  {
    value: MEASURE_PROPERTY_TYPE,
    label: structuresI18n.t("component.type.measure.title"),
    labelPlural: structuresI18n.t("component.type.measure.pluralTitle"),
  },
];

export const DISSEMINATION_STATUS = {
  PUBLIC_GENERIC: "http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique",
};
