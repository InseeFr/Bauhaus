import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import { dictionary } from 'js/utils/dictionary';
import { ExplanatoryNote } from 'js/components/shared/explanatory-note';
import 'css/concept-notes.css';

class ConceptCompareNotes extends Component {
	render() {
		const {
			secondLang,
			notesVersion1,
			notesVersion2,
			langs: { lg1, lg2 },
		} = this.props;

		return (
			<div className="container">
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.scopeNoteLg1}
							title={dictionary.notes.scopeNote}
							lang={lg1}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.scopeNoteLg1}
							title={dictionary.notes.scopeNote}
							lang={lg1}
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.scopeNoteLg2}
							title={dictionary.notes.scopeNote}
							lang={lg2}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.scopeNoteLg2}
							title={dictionary.notes.scopeNote}
							lang={lg2}
							alone={false}
						/>
					</div>
				)}
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionLg1}
							title={dictionary.notes.definition}
							lang={lg1}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionLg1}
							title={dictionary.notes.definition}
							lang={lg1}
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionLg2}
							title={dictionary.notes.definition}
							lang={lg2}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionLg2}
							title={dictionary.notes.definition}
							lang={lg2}
							alone={false}
						/>
					</div>
				)}
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.editorialNoteLg1}
							title={dictionary.notes.editorialeNote}
							lang={lg1}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.editorialNoteLg1}
							title={dictionary.notes.editorialeNote}
							lang={lg1}
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.editorialNoteLg2}
							title={dictionary.notes.editorialeNote}
							lang={lg2}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.editorialNoteLg2}
							title={dictionary.notes.editorialeNote}
							lang={lg2}
							alone={false}
						/>
					</div>
				)}
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.changeNoteLg1}
							title={dictionary.notes.changeNote}
							lang={lg1}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.changeNoteLg1}
							title={dictionary.notes.changeNote}
							lang={lg1}
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.changeNoteLg2}
							title={dictionary.notes.changeNote}
							lang={lg2}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.changeNoteLg2}
							title={dictionary.notes.changeNote}
							lang={lg2}
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
	notesVersion1: notesPropTypes,
	notesVersion2: notesPropTypes,
	langs: PropTypes.object.isRequired,
};

export default ConceptCompareNotes;
