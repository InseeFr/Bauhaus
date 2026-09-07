import { ValidationState } from "@components/status";

import { RelatedItem } from "./related-item";

export interface Family {
  id: string;
  prefLabelLg1?: string;
  prefLabelLg2?: string;
  validationState: ValidationState;
  created: string;
  modified: string;
  abstractLg1: string;
  abstractLg2: string;
  series: RelatedItem[];
}

export interface FamilyHome {
  id: string;
  label: string;
}
