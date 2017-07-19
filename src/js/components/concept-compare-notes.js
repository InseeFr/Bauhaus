import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import { dictionary } from 'js/utils/dictionary';
import { ExplanatoryNote } from 'js/utils/explanatory-note';
import 'css/concept-notes.css';

class ConceptCompareNotes extends Component {
	render() {
		const { english, notesVersion1, notesVersion2 } = this.props;

		return (
			<div className="container">
				{!english &&
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionCourteFr}
							title={dictionary.notes.scopeNote}
							lang="fr"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionCourteFr}
							title={dictionary.notes.scopeNote}
							lang="fr"
							alone={false}
						/>
					</div>}
				{english &&
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionCourteEn}
							title={dictionary.notes.scopeNote}
							lang="en"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionCourteEn}
							title={dictionary.notes.scopeNote}
							lang="en"
							alone={false}
						/>
					</div>}
				{!english &&
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionFr}
							title={dictionary.notes.definition}
							lang="fr"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionFr}
							title={dictionary.notes.definition}
							lang="fr"
							alone={false}
						/>
					</div>}
				{english &&
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionEn}
							title={dictionary.notes.definition}
							lang="en"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionEn}
							title={dictionary.notes.definition}
							lang="en"
							alone={false}
						/>
					</div>}
				{!english &&
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.noteEditorialeFr}
							title={dictionary.notes.editorialeNote}
							lang="fr"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.noteEditorialeFr}
							title={dictionary.notes.editorialeNote}
							lang="fr"
							alone={false}
						/>
					</div>}
				{english &&
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.noteEditorialeEn}
							title={dictionary.notes.editorialeNote}
							lang="en"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.noteEditorialeEn}
							title={dictionary.notes.editorialeNote}
							lang="en"
							alone={false}
						/>
					</div>}
				{!english &&
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.changeNoteFr}
							title={dictionary.notes.changeNote}
							lang="fr"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.changeNoteFr}
							title={dictionary.notes.changeNote}
							lang="fr"
							alone={false}
						/>
					</div>}
				{english &&
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.changeNoteEn}
							title={dictionary.notes.changeNote}
							lang="en"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.changeNoteEn}
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
	conceptGeneral: generalPropTypes,
	notesVersion1: notesPropTypes,
	notesVersion2: notesPropTypes,
};

export default ConceptCompareNotes;
