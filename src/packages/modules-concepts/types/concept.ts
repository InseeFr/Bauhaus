export type Concept = {
  id: string;
  label: string;
  altLabel: string | null;
  _links: {
    self: {
      href: string;
    };
  };
};

export type ConceptForAdvancedSearch = {
  id: string;
  label: string;
  created: string;
  modified: string;
  disseminationStatus: string;
  validationStatus: string;
  definition: string;
  creator: string;
  isTopConceptOf: string;
  valid: string | null;
  altLabel: string | null;
};
