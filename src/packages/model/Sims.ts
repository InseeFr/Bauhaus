import { ValidationState } from "@components/status";

import { Document } from "./operations/document";

export interface Rubric {
  idAttribute: string;
  labelLg1: string;
  labelLg2: string;
  documentsLg1?: Document[];
  documentsLg2?: Document[];
  rangeType: string;
}

export interface Sims {
  id: string;
  creators: string[];
  idIndicator?: string;
  idOperation?: string;
  idSeries?: string;
  validationState: ValidationState;
  parentsWithoutSims: any[];
  rubrics: Rubric[];
  updated?: string;
  created?: string;
}

export interface MetadataStructure {
  idMas: string;
  isPresentational: boolean;
  children: Record<string, MetadataStructure>;
}
