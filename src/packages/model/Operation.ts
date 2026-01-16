import { ValidationState } from "@components/status";

import { Series } from "./operations/series";

/**
 * Type used when fetching all Series
 */
export interface Operation {
  id: string;
  label: string;
  altLabel: string;
  year: string;
  iri: string;
  seriesIri: string;
  idSims?: string;
  series: Series;
  validationState: ValidationState;
  prefLabelLg1?: string;
  created: string;
  modified: string;
  altLabelLg1: string;
  altLabelLg2: string;
}

export interface SeeAlso {
  type: string;
}
