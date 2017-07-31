import React from 'react';
import PropTypes from 'prop-types';
import { dictionary } from 'js/utils/dictionary';
import { ExplanatoryNote } from 'js/utils/explanatory-note';
import 'css/concept-notes.css';

function ConceptNotes({ english, notes }) {
  const {
    scopeNoteLg1,
    scopeNoteLg2,
    definitionLg1,
    definitionLg2,
    editorialNoteLg1,
    editorialNoteLg2,
    changeNoteLg1,
    changeNoteLg2,
  } = notes;
  return (
    <div>
      {scopeNoteLg1 &&
        <div className="row">
          <ExplanatoryNote
            text={scopeNoteLg1}
            title={dictionary.notes.scopeNote}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={scopeNoteLg2}
              title={dictionary.notes.scopeNote}
              lang="en"
              alone={false}
            />}
        </div>}
      {definitionLg1 &&
        <div className="row">
          <ExplanatoryNote
            text={definitionLg1}
            title={dictionary.notes.definition}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={definitionLg2}
              title={dictionary.notes.definition}
              lang="en"
              alone={false}
            />}
        </div>}
      {editorialNoteLg1 &&
        <div className="row">
          <ExplanatoryNote
            text={editorialNoteLg1}
            title={dictionary.notes.editorialeNote}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={editorialNoteLg2}
              title={dictionary.notes.editorialeNote}
              lang="en"
              alone={false}
            />}
        </div>}
      {changeNoteLg1 &&
        <div className="row">
          <ExplanatoryNote
            text={changeNoteLg1}
            title={dictionary.notes.changeNote}
            lang="fr"
            alone={!english}
          />
          {english &&
            <ExplanatoryNote
              text={changeNoteLg2}
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
