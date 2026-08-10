/**
 * Objet lié tel que l'API le renvoie dans les relations entre objets
 * d'opérations (famille → ses séries, opération → sa série) : l'identifiant et
 * les deux libellés, de quoi afficher un lien dans les deux langues.
 */
export interface RelatedItem {
  id: string;
  labelLg1: string;
  labelLg2: string;
}
