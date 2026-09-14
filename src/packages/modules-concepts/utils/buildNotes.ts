import { ConceptNotes } from "@model/concepts/concept";

export const buildNotes = (n: ConceptNotes) => [
  { lg1: n.scopeNoteLg1, lg2: n.scopeNoteLg2, title: "conceptsScopeNote" },
  { lg1: n.definitionLg1, lg2: n.definitionLg2, title: "conceptsDefinition" },
  {
    lg1: n.editorialNoteLg1,
    lg2: n.editorialNoteLg2,
    title: "conceptsEditorialNote",
  },
  { lg1: n.changeNoteLg1, lg2: n.changeNoteLg2, title: "conceptsChangeNote" },
];
