export interface ItemShortLabel {
  /** Longueur maximale du titre abrégé, telle que renvoyée par le back. */
  length: string;
  shortLabelLg1?: string;
  shortLabelLg2?: string;
  shortLabelUri?: string;
}

export interface ItemGeneral {
  prefLabelLg1: string;
  prefLabelLg2: string;
  altLabels?: ItemShortLabel[];
}

export interface PartialClassificationSerie {
  id: string;
  label: string;
  altLabels: string;
}
