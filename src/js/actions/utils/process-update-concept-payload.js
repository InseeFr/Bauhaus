import prefixWithHttp from 'js/utils/prefix-with-http';
import { extractLinks } from 'js/utils/concepts/links';
import { processChanges } from 'js/utils/concepts/notes';
import { VERSIONING } from 'js/constants';

export default function updateConceptPayload(
  versioning,
  oldConcept,
  newConcept
) {
  const { notes: oldNotes } = oldConcept;

  const {
    general: newGeneral,
    notes: newNotes,
    conceptsWithLinks: newConceptsWithLinks,
  } = newConcept;

  const newLinks = extractLinks(newConceptsWithLinks);
  //`additionalMaterial` is supposed to be an URL
  //TODO Fix type here and there with `additional` and `versionning` (should be fix on the
  //server first)
  newGeneral.additionalMaterial = prefixWithHttp(newGeneral.additionalMaterial);

  const notesChanges = processChanges(oldNotes, newNotes, true);
  return {
    wantToVersionning: versioning === VERSIONING ? true : false,
    ...newGeneral, //prefLabelLg1, prefLabelLg2...
    ...newLinks,
    ...newNotes, //definitionLg1, definitionLg1Version, definitionLg2...
    ...notesChanges, //definitionLg1Changed, definitionLg2Changed...
  };
}
