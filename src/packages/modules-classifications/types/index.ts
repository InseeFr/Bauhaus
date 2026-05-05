export type Classification = {
  id: string;
  prefLabelLg1: string;
  prefLabelLg2: string;
  altLabelLg1: string;
  altLabelLg2: string;
  descriptionLg1: string;
  descriptionLg2: string;
  disseminationStatus: string;
  creator: string | string[];
  contributor: string | string[];
  idSeries: string;
  idAfter: string;
  idBefore?: string;
  idVariant?: string;
  seriesLg1: string;
  afterLg1: string;
  issued: string;
  lastRefreshedOn: string;
  additionalMaterial?: string;
  legalMaterial?: string;
  homepage?: string;
  scopeNoteUriLg1?: string;
  scopeNoteUriLg2?: string;
  scopeNoteLg1?: string;
  scopeNoteLg2?: string;
  changeNoteUriLg1?: string;
  changeNoteUriLg2?: string;
  changeNoteLg1?: string;
  changeNoteLg2?: string;
};

export type Level = {
  id: string;
  labelLg1: string;
  labelLg1_lg: string;
};

export type ClassificationWithLevels = {
  general: Classification;
  levels: Level[];
};

export interface PartialClassification {
  id: string;
  label: string;
  altLabels: string;
}
