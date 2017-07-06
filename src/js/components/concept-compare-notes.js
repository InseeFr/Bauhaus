import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dictionary } from 'js/utils/dictionary';
import { ExplanatoryNote } from 'js/utils/explanatory-note';
import { loadConceptNotes } from '../actions/concept-by-id';
import 'css/concept-notes.css';

class ConceptCompareNotes extends Component {
  componentWillMount() {
    for (var i = 1; i < this.props.conceptGeneral.conceptVersion; i++) {
      this.props.loadConceptNotes(this.props.conceptGeneral.id, i);
    }
  }

  render() {
    const {
      conceptNotes,
      conceptGeneral,
      english,
      version1,
      version2,
    } = this.props;
    const notes1 = conceptNotes[conceptGeneral.id][version1];
    const notes2 = conceptNotes[conceptGeneral.id][version2];

    if (!notes1 || !notes2) return null;
    return (
      <div className="container">
        {!english &&
          <div className="row">
            <ExplanatoryNote
              text={notes1.definitionCourteFr}
              title={dictionary.notes.scopeNote}
              lang="fr"
              alone={false}
            />
            <ExplanatoryNote
              text={notes2.definitionCourteFr}
              title={dictionary.notes.scopeNote}
              lang="fr"
              alone={false}
            />
          </div>}
        {english &&
          <div className="row">
            <ExplanatoryNote
              text={notes1.definitionCourteEn}
              title={dictionary.notes.scopeNote}
              lang="en"
              alone={false}
            />
            <ExplanatoryNote
              text={notes2.definitionCourteEn}
              title={dictionary.notes.scopeNote}
              lang="en"
              alone={false}
            />
          </div>}
        {!english &&
          <div className="row">
            <ExplanatoryNote
              text={notes1.definitionFr}
              title={dictionary.notes.definition}
              lang="fr"
              alone={false}
            />
            <ExplanatoryNote
              text={notes2.definitionFr}
              title={dictionary.notes.definition}
              lang="fr"
              alone={false}
            />
          </div>}
        {english &&
          <div className="row">
            <ExplanatoryNote
              text={notes1.definitionEn}
              title={dictionary.notes.definition}
              lang="en"
              alone={false}
            />
            <ExplanatoryNote
              text={notes2.definitionEn}
              title={dictionary.notes.definition}
              lang="en"
              alone={false}
            />
          </div>}
        {!english &&
          <div className="row">
            <ExplanatoryNote
              text={notes1.noteEditorialeFr}
              title={dictionary.notes.editorialeNote}
              lang="fr"
              alone={false}
            />
            <ExplanatoryNote
              text={notes2.noteEditorialeFr}
              title={dictionary.notes.editorialeNote}
              lang="fr"
              alone={false}
            />
          </div>}
        {english &&
          <div className="row">
            <ExplanatoryNote
              text={notes1.noteEditorialeEn}
              title={dictionary.notes.editorialeNote}
              lang="en"
              alone={false}
            />
            <ExplanatoryNote
              text={notes2.noteEditorialeEn}
              title={dictionary.notes.editorialeNote}
              lang="en"
              alone={false}
            />
          </div>}
        {!english &&
          <div className="row">
            <ExplanatoryNote
              text={notes1.changeNoteFr}
              title={dictionary.notes.changeNote}
              lang="fr"
              alone={false}
            />
            <ExplanatoryNote
              text={notes2.changeNoteFr}
              title={dictionary.notes.changeNote}
              lang="fr"
              alone={false}
            />
          </div>}
        {english &&
          <div className="row">
            <ExplanatoryNote
              text={notes1.changeNoteEn}
              title={dictionary.notes.changeNote}
              lang="en"
              alone={false}
            />
            <ExplanatoryNote
              text={notes2.changeNoteEn}
              title={dictionary.notes.changeNote}
              lang="en"
              alone={false}
            />
          </div>}
      </div>
    );
  }
}

ConceptCompareNotes.propTypes = {
  english: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  conceptNotes: state.conceptNotes,
});

const mapDispatchToProps = {
  loadConceptNotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ConceptCompareNotes
);
