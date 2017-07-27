import { NONE } from 'js/constants';

/**
 * Returns a function to extract the given keys from an object
 */
const takeKeys = keys => obj =>
  keys.reduce((extract, key) => {
    extract[key] = obj[key];
    return extract;
  }, {});

const extractGeneral = takeKeys([
  'prefLabelLg1',
  'prefLabelLg2',
  'altLabelLg1',
  'altLabelLg2',
  'creator',
  'contributor',
  'disseminationStatus',
  'additionalMaterial',
  'valid',
]);

const extractVersNotes = takeKeys([
  'scopeNoteLg1',
  'scopeNoteLg2',
  'definitionLg1',
  'definitionLg2',
  'editorialNoteLg1',
  'editorialNoteLg2',
]);

export default function buildPayloadCreation(data) {
  const general = extractGeneral(data.general);
  const versNotesObj = extractVersNotes(data.notes);
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
      const content = data.notes[noteType];
      if (content)
        return {
          noteType,
          content,
        };
    })
    //remove empty notes
    .filter(note => note);

  /*
    Links should like [
      {
        typeOfLink: 'broader',
        ids: ['first-concept']
      }, {
        typeOfLink: 'narrower',
        ids: ['second-concept']
      }
      // if there is no concept for a type of link, we do not create an entry
      //in tthe array
    ]
      
      //no entry if there no links of a given type
    }
  */
  //First we represent the information as an object to allow iterating over
  //the object keys later
  const linksObj = data.conceptsWithLinks.reduce(
    (links, { id, typeOfLink }) => {
      if (typeOfLink === NONE) return links;
      if (!links[typeOfLink]) links[typeOfLink] = [id];
      else links[typeOfLink].push(id);
      return links;
    },
    {}
  );
  //We should create an entry for each of the key of `linksOb`
  const links = Object.keys(linksObj).reduce((linkArr, typeOfLink) => {
    const ids = linksObj[typeOfLink];
    linkArr.push({
      typeOfLink,
      ids,
    });
    return linkArr;
  }, []);

  return {
    ...general,
    versionableNotes,
    datableNotes,
    links,
  };
}
