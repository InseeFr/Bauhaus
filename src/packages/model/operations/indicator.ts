import { ValidationState } from "@components/status";

export interface Indicator {
  id: string;
  idSims: string;
  validationState: ValidationState;
  creators: string[];
}

export type IndicatorsList = {
  altLabel: string;
  id: string;
  label: string;
}[];
