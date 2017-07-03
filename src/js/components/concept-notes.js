import React, { PropTypes } from 'react';
import { dictionary } from '../utils/dictionary';
import { ExplanatoryNote } from '../utils/explanatory-note';
import '../../css/concept-notes.css';

function ConceptNotes({ english, attr }) {
  return (
    <div>
      {attr.definitionCourteFr &&
        <div className="row">
          <ExplanatoryNote
            text={attr.definitionCourteFr}
            title={dictionary.notes.scopeNote}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={attr.definitionCourteEn}
              title={dictionary.notes.scopeNote}
              lang="en"
              alone={false}
            />}
        </div>}
      {attr.definitionFr &&
        <div className="row">
          <ExplanatoryNote
            text={attr.definitionFr}
            title={dictionary.notes.definition}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={attr.definitionEn}
              title={dictionary.notes.definition}
              lang="en"
              alone={false}
            />}
        </div>}
      {attr.noteEditorialeFr &&
        <div className="row">
          <ExplanatoryNote
            text={attr.noteEditorialeFr}
            title={dictionary.notes.editorialeNote}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={attr.noteEditorialeEn}
              title={dictionary.notes.editorialeNote}
              lang="en"
              alone={false}
            />}
        </div>}
      {attr.changeNoteFr &&
        <div className="row">
          <ExplanatoryNote
            text={attr.changeNoteFr}
            title={dictionary.notes.changeNote}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={attr.changeNoteEn}
              title={dictionary.notes.changeNote}
              lang="en"
              alone={false}
            />}
        </div>}
    </div>
  );
}

ConceptNotes.propTypes = {
  english: PropTypes.bool.isRequired,
  attr: PropTypes.object.isRequired,
};
export default ConceptNotes;
