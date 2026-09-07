/**
 * Lien entre deux objets d'opérations, tel que l'API le renvoie dans `seeAlso`,
 * `replaces`, `isReplacedBy` et `wasGeneratedBy`.
 *
 * Le back ne pose ces propriétés que lorsqu'au moins un lien existe : elles sont
 * absentes de la réponse, et non vides, quand l'objet n'en a aucun.
 */
export interface OperationsLink {
  id: string;
  /** Type de l'objet lié (`series`, `indicator`…), déduit de son `rdf:type`. */
  type: string;
  labelLg1: string;
  /** Le libellé de langue 2 est optionnel dans le référentiel. */
  labelLg2?: string;
}
