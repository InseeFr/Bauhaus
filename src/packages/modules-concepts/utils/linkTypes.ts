import { BROADER, NARROWER, REFERENCES, SUCCEED, RELATED, CLOSE_MATCH } from "@sdk/constants";

export interface LinkTypeDefinition {
  titleKey: string;
  memberType: string;
}

/**
 * Les six types de lien d'un concept, dans l'ordre où ils sont présentés.
 * Leurs intitulés restent en français quelle que soit la langue de l'utilisateur :
 * ce sont les termes du thésaurus.
 */
export const LINK_TYPES: LinkTypeDefinition[] = [
  { titleKey: "concept.links.narrowerTitle", memberType: NARROWER },
  { titleKey: "concept.links.broaderTitle", memberType: BROADER },
  { titleKey: "concept.links.referencesTitle", memberType: REFERENCES },
  { titleKey: "concept.links.replacesTitle", memberType: SUCCEED },
  { titleKey: "concept.links.relatedTitle", memberType: RELATED },
  { titleKey: "concept.links.equivalentTitle", memberType: CLOSE_MATCH },
];
