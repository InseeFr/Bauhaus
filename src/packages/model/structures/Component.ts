import { ValidationState } from "@components/status";

export interface Component {
  identifiant?: string;
  iri?: string;
  type?: string;
  validationState?: ValidationState;
  id?: string;
  labelLg1?: string;
  labelLg2?: string;
  altLabelLg1?: string;
  altLabelLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
  notation?: string;
  required?: boolean;
  attachment?: string[];
  codeList?: string;
  fullCodeListValue?: string;
  concept?: string;
  contributor: string[];
  structures: string[];
  creator?: string;
  disseminationStatus?: string;
  created?: string;
  modified?: string;
  // Representation (`XSD_TYPES`) fields.
  range?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minInclusive?: number;
  maxInclusive?: number;
}

export interface ComponentDefinition {
  id?: string;
  component: Component;
  order?: string | number;
}
