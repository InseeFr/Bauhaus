export interface Code {
  iri: string;
  labelLg1: string;
  labelLg2: string;
  code: string;
  lastCodeUriSegment: string;
  broader?: string[];
  narrower?: string[];
  closeMatch?: string[];
}

export interface Codelist {
  id?: string;
  codes: Code[];
  notation: string;
  lastCodeUriSegment: string;
  contributor: string;
}

export type Codelists = {
  id: string;
  label: string;
  notation: string;
}[];
