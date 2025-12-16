import { ValidationState } from "@components/status";

export interface PartialStructure {
  iri: string;
  labelLg1: string;
}
export type StructuresList = PartialStructure[];

export interface Structure {
  id: string;
  labelLg1: string;
  labelLg2: string;
  descriptionLg1: string;
  descriptionLg2: string;
  componentDefinitions: any[];
  disseminationStatus: string;
  creator: string;
  identifiant: string;
  created: string;
  modified: string;
  contributor: string[] | string;
  validationState: ValidationState;
}
