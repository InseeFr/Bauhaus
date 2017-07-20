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
  //TODO Fix type here and there with `additionnal` and `versionning` (should be fix on the
  //server first)
  newGeneral.additionnalMaterial = prefixWithHttp(
    newGeneral.additionnalMaterial
  );

  const notesChanges = processChanges(oldNotes, newNotes, true);
  return {
    wantToVersionning: versioning === VERSIONING ? true : false,
    ...newGeneral, //prefLabelFr, prefLabelEn...
    ...newLinks,
    ...newNotes, //definitionFr, definitionFrVersion, definitionEn...
    ...notesChanges, //definitionFrChanged, definitionEnChanged...
  };
}
