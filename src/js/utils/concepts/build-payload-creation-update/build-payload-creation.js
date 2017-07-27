//TODO these utils should stay closer to the components which use them
import { processLinks, processGeneral } from './shared';
import takeKeys from 'js/utils/take-keys';

const generalFieldsToKeep = [
  'prefLabelLg1',
  'prefLabelLg2',
  'altLabelLg1',
  'altLabelLg2',
  'creator',
  'contributor',
  'disseminationStatus',
  'additionalMaterial',
  'valid',
];

//TODO refactor with `build-payload-update` and `/js/utils/concepts/notes.js`
const extractVersNotes = takeKeys([
  'scopeNoteLg1',
  'scopeNoteLg2',
  'definitionLg1',
  'definitionLg2',
  'editorialNoteLg1',
  'editorialNoteLg2',
]);

export default function buildPayloadCreation(concept) {
  const { general: rawGeneral, notes, conceptsWithLinks } = concept;

  const general = processGeneral(rawGeneral, generalFieldsToKeep);
  const links = processLinks(conceptsWithLinks);

  const versNotesObj = extractVersNotes(notes);
  //ATTENTION we expect the properties used in the UI (and enumerated above)
  //to match exactly the type attribute used to build the array of notes
  const versionableNotes = Object.keys(versNotesObj).reduce((arr, noteType) => {
    const content = versNotesObj[noteType];
    if (content)
      arr.push({
        noteType,
        content,
      });
    return arr;
  }, []);

  const datableNotes = ['changeNoteLg1', 'changeNoteLg2']
    .map(noteType => {
      const content = notes[noteType];
      if (content)
        return {
          noteType,
          content,
        };
    })
    //remove empty notes
    .filter(note => note);

  return {
    ...general,
    versionableNotes,
    datableNotes,
    links,
  };
}
