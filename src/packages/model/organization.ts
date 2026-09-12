export interface Organization {
  iri: string;
  label: string;
  labelLg2: string;
  /** adms:identifier, de la forme HIE2001201 */
  id: string;
  /** dcterms:identifier, le timbre : c'est lui que porte le jeton de l'utilisateur */
  stamp?: string;
}
