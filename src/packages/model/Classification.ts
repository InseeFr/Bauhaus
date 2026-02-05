import { ValidationState } from "@components/status";

export interface ClassificationGeneral {
  id: string;
  prefLabelLg1: string;
  prefLabelLg2: string;
  scopeNoteLg1: string;
  scopeNoteLg2: string;
  changeNoteLg1: string;
  changeNoteLg2: string;
  descriptionLg1: string;
  descriptionLg2: string;
}

export interface Classification {
  id: string;
  general: ClassificationGeneral;
  levels: unknown[];
  validationState: ValidationState;
}

export interface PartialClassification {
  id: string;
  label: string;
  altLabels: string;
}

export interface ItemGeneral {
  prefLabelLg1: string;
  prefLabelLg2: string;
  altLabelsLg1_?: string;
}

export interface PartialClassificationSerie {
  id: string;
  label: string;
  altLabels: string;
}
