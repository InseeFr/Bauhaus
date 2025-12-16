import D from "../../../../../../deprecated-locales";

export const buildData = (d) => [
  {
    id: 1,
    type: D.collectionsNumberTitle,
    total: d.length,
  },
  {
    id: 2,
    type: D.provisionalConceptsNumberTitle,
    total: d.filter((c) => c.isValidated === "false").length,
  },
];
