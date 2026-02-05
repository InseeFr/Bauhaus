export interface Collection {
  id: string;
  prefLabelLg1: string;
  creator: string;
}

export interface PartialCollection {
  id: string;
  label: {
    value: string;
    lang: string;
  };
}

export interface UnpublishedCollection {
  id: string;
  label: string;
  creator: string;
}
