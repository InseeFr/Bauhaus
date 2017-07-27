import PropTypes from 'prop-types';
import objectFromKeys from 'js/utils/object-from-keys';

export const versionableNotes = [
  'scopeNoteLg1',
  'scopeNoteLg2',
  'definitionLg1',
  'definitionLg2',
  'editorialNoteLg1',
  'editorialNoteLg2',
];

export const datableNotes = ['changeNoteLg1', 'changeNoteLg2'];

const allNotes = [...versionableNotes, ...datableNotes];

export const fields = allNotes;

export const capitalizeFirst = str =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const processChanges = (oldNotes, notes, fields) =>
  fields.reduce((changes, noteType) => {
    const oldContent = oldNotes[noteType];
    const content = notes[noteType];
    if (oldContent !== content)
      changes.push({
        noteType,
        content,
      });
    return changes;
  }, []);

export const processVersionableChanges = (oldNotes, notes) =>
  processChanges(oldNotes, notes, versionableNotes);
export const processDatableChanges = (oldNotes, notes) =>
  processChanges(oldNotes, notes, datableNotes);
export const processAllChanges = (oldNotes, notes) =>
  processChanges(oldNotes, notes, allNotes);

const versionImpactingNotes = [
  'definitionCourteLg1',
  'definitionLg1',
  'noteEditorialeLg1',
];

export const areNotesImpactingVersionChanged = (oldNotes, notes) => {
  return processChanges(oldNotes, notes, versionImpactingNotes).length > 0;
};

export const propTypes = PropTypes.shape(
  objectFromKeys(fields, PropTypes.string)
);
