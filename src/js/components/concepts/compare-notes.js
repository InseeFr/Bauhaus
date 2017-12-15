import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import { dictionary } from 'js/utils/dictionary';
import { ExplanatoryNote } from 'js/components/shared/explanatory-note';
import 'css/concept-notes.css';

class ConceptCompareNotes extends Component {
	render() {
		const { secondLang, notesVersion1, notesVersion2 } = this.props;

		return (
			<div className="container">
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.scopeNoteLg1}
							title={dictionary.notes.scopeNote}
							lang="fr"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.scopeNoteLg1}
							title={dictionary.notes.scopeNote}
							lang="fr"
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.scopeNoteLg2}
							title={dictionary.notes.scopeNote}
							lang="en"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.scopeNoteLg2}
							title={dictionary.notes.scopeNote}
							lang="en"
							alone={false}
						/>
					</div>
				)}
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionLg1}
							title={dictionary.notes.definition}
							lang="fr"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionLg1}
							title={dictionary.notes.definition}
							lang="fr"
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionLg2}
							title={dictionary.notes.definition}
							lang="en"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionLg2}
							title={dictionary.notes.definition}
							lang="en"
							alone={false}
						/>
					</div>
				)}
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.editorialNoteLg1}
							title={dictionary.notes.editorialeNote}
							lang="fr"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.editorialNoteLg1}
							title={dictionary.notes.editorialeNote}
							lang="fr"
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.editorialNoteLg2}
							title={dictionary.notes.editorialeNote}
							lang="en"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.editorialNoteLg2}
							title={dictionary.notes.editorialeNote}
							lang="en"
							alone={false}
						/>
					</div>
				)}
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.changeNoteLg1}
							title={dictionary.notes.changeNote}
							lang="fr"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.changeNoteLg1}
							title={dictionary.notes.changeNote}
							lang="fr"
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.changeNoteLg2}
							title={dictionary.notes.changeNote}
							lang="en"
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.changeNoteLg2}
							title={dictionary.notes.changeNote}
							lang="en"
							alone={false}
						/>
					</div>
				)}
			</div>
		);
	}
}

ConceptCompareNotes.propTypes = {
	secondLang: PropTypes.bool.isRequired,
	conceptGeneral: generalPropTypes,
	notesVersion1: notesPropTypes,
	notesVersion2: notesPropTypes,
};

export default ConceptCompareNotes;
