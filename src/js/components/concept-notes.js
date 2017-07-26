import React from 'react';
import PropTypes from 'prop-types';
import { dictionary } from 'js/utils/dictionary';
import { ExplanatoryNote } from 'js/utils/explanatory-note';
import 'css/concept-notes.css';

function ConceptNotes({ english, notes }) {
  const {
    definitionCourteFr,
    definitionCourteEn,
    definitionFr,
    definitionEn,
    noteEditorialeFr,
    noteEditorialeEn,
    changeNoteFr,
    changeNoteEn,
  } = notes;
  return (
    <div>
      {definitionCourteFr &&
        <div className="row">
          <ExplanatoryNote
            text={definitionCourteFr}
            title={dictionary.notes.scopeNote}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={definitionCourteEn}
              title={dictionary.notes.scopeNote}
              lang="en"
              alone={false}
            />}
        </div>}
      {definitionFr &&
        <div className="row">
          <ExplanatoryNote
            text={definitionFr}
            title={dictionary.notes.definition}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={definitionEn}
              title={dictionary.notes.definition}
              lang="en"
              alone={false}
            />}
        </div>}
      {noteEditorialeFr &&
        <div className="row">
          <ExplanatoryNote
            text={noteEditorialeFr}
            title={dictionary.notes.editorialeNote}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={noteEditorialeEn}
              title={dictionary.notes.editorialeNote}
              lang="en"
              alone={false}
            />}
        </div>}
      {changeNoteFr &&
        <div className="row">
          <ExplanatoryNote
            text={changeNoteFr}
            title={dictionary.notes.changeNote}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={changeNoteEn}
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
  notes: PropTypes.object.isRequired,
};
export default ConceptNotes;
