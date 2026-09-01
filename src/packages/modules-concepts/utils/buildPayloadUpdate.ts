import { CLOSE_MATCH, VERSIONING } from "@sdk/constants";

import { ConceptGeneral, ConceptNotes, Link } from "../../model/concepts/concept";
import { keepDatableNotes } from "./keepDatableNotes";
import { processGeneral } from "./processGeneral";
import { processLinks } from "./processLinks";
import { processVersionableChanges } from "./processVersionableChanges";

interface ConceptInput {
  general: ConceptGeneral;
  notes: ConceptNotes;
  conceptsWithLinks: { id: string; typeOfLink: string }[];
  equivalentLinks?: (Link & { urn: string })[];
}

interface OldConceptInput {
  notes: ConceptNotes;
}

interface UrnLink {
  typeOfLink: typeof CLOSE_MATCH;
  urn: string[];
}

type LinkEntry = { typeOfLink: string; ids: string[] } | UrnLink;

const generalFieldsToKeep: (keyof ConceptGeneral)[] = [
  "prefLabelLg1",
  "prefLabelLg2",
  "altLabelLg1",
  "altLabelLg2",
  "creator",
  "created",
  "contributor",
  "disseminationStatus",
  "additionalMaterial",
  "valid",
  "collections",
];

export function buildPayloadUpdate(
  versioning: string,
  oldConcept: OldConceptInput,
  concept: ConceptInput,
) {
  const { notes: oldNotes } = oldConcept;

  const { general: rawGeneral, notes, conceptsWithLinks } = concept;

  const general = processGeneral(rawGeneral, generalFieldsToKeep);

  const links: LinkEntry[] = [...processLinks(conceptsWithLinks)];

  if (concept.equivalentLinks && concept.equivalentLinks.length > 0) {
    links.push(
      concept.equivalentLinks.reduce<UrnLink>(
        (acc, link) => ({
          typeOfLink: CLOSE_MATCH,
          urn: [...acc.urn, link.urn],
        }),
        { typeOfLink: CLOSE_MATCH, urn: [] },
      ),
    );
  }

  return {
    versioning: versioning === VERSIONING,
    ...general,
    links,
    datableNotes: keepDatableNotes(notes),
    versionableNotes: processVersionableChanges(oldNotes, notes),
  };
}
