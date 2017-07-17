import prefixWithHttp from 'js/utils/prefix-with-http';
import { extractLinks } from 'js/utils/concepts/links';
import { processChanges } from 'js/utils/concepts/notes';

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
  newGeneral.additionalMaterial = prefixWithHttp(
    newGeneral.additionnalMaterial
  );

  const notesChanges = processChanges(oldNotes, newNotes);
  return {
    wantToVersioning: versioning,
    ...newGeneral, //prefLabelFr, prefLabelEn...
    ...newLinks,
    ...newNotes, //definitionFr, definitionFrVersion, definitionEn...
    ...notesChanges, //definitionFrChanged, definitionEnChanged...
  };
}
