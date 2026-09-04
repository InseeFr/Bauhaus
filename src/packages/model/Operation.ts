import { ValidationState } from "@components/status";

import { RelatedItem } from "./operations/related-item";
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
  /** L'API renvoie ici les libellés du lien en plus des champs de série lus par le menu. */
  series: Series & RelatedItem;
  validationState: ValidationState;
  prefLabelLg1?: string;
  prefLabelLg2?: string;
  created: string;
  modified: string;
  altLabelLg1: string;
  altLabelLg2: string;
}
