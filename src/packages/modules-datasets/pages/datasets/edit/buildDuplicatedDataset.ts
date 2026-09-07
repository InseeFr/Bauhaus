import { Dataset } from "../../../../model/Dataset";

/**
 * Prépare le formulaire de création à partir d'un jeu de données existant.
 *
 * L'identité (id, identifiant alternatif) et le cycle de vie (état de publication,
 * dates du catalog record) ne sont pas repris : ils sont regénérés par le back-office
 * à la création. Les distributions ne sont pas dupliquées, elles sont portées par
 * leur propre ressource et rattachées explicitement à un jeu de données.
 */
export const buildDuplicatedDataset = (dataset: Dataset) => {
  const {
    id: _id,
    altIdentifier: _altIdentifier,
    validationState: _validationState,
    catalogRecord,
    ...duplicableFields
  } = dataset;

  return {
    ...duplicableFields,
    catalogRecord: {
      creator: catalogRecord?.creator,
      contributor: catalogRecord?.contributor,
    },
  };
};
