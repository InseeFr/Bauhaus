import { BROADER, IS_REPLACED_BY, NARROWER, REFERENCES, RELATED, SUCCEED } from "@sdk/constants";

import { linkTypes } from "../../modules-concepts/utils/links";

export interface ConceptGeneral {
  id: string;
  prefLabelLg1: string;
  prefLabelLg2: string;
  altLabelLg1?: string[] | string;
  altLabelLg2?: string[] | string;
  conceptVersion: string;
  creator: string;
  contributor: string;
  disseminationStatus: string;
  created: string;
  modified: string;
  isValidated: string;
  valid: boolean;
  additionalMaterial?: string;
}

export interface ConceptNotes {
  scopeNoteLg1?: string;
  scopeNoteLg2?: string;
  definitionLg1: string;
  definitionLg2?: string;
  changeNoteLg1?: string;
  changeNoteLg2?: string;
  editorialNoteLg1?: string;
  editorialNoteLg2?: string;
}

export interface Concept {
  general: ConceptGeneral;
  notes: ConceptNotes;
  links: Link[];
}

export interface Links {
  [NARROWER]: Link[];
  [BROADER]: Link[];
  [REFERENCES]: Link[];
  [SUCCEED]: Link[];
  [RELATED]: Link[];
  [IS_REPLACED_BY]: Link[];
  closeMatch: Link[];
}

export interface Link {
  id: string;
  typeOfLink: keyof typeof linkTypes;
  prefLabelLg1: string;
  prefLabelLg2: string;
  urn: string;
}
