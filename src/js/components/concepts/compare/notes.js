import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import D from 'js/i18n';
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
							title={D.conceptsScopeNote}
							lang={lg1}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.scopeNoteLg1}
							title={D.conceptsScopeNote}
							lang={lg1}
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.scopeNoteLg2}
							title={D.conceptsScopeNote}
							lang={lg2}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.scopeNoteLg2}
							title={D.conceptsScopeNote}
							lang={lg2}
							alone={false}
						/>
					</div>
				)}
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionLg1}
							title={D.conceptsDefinition}
							lang={lg1}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionLg1}
							title={D.conceptsDefinition}
							lang={lg1}
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.definitionLg2}
							title={D.conceptsDefinition}
							lang={lg2}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.definitionLg2}
							title={D.conceptsDefinition}
							lang={lg2}
							alone={false}
						/>
					</div>
				)}
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.editorialNoteLg1}
							title={D.conceptsEditorialNote}
							lang={lg1}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.editorialNoteLg1}
							title={D.conceptsEditorialNote}
							lang={lg1}
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.editorialNoteLg2}
							title={D.conceptsEditorialNote}
							lang={lg2}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.editorialNoteLg2}
							title={D.conceptsEditorialNote}
							lang={lg2}
							alone={false}
						/>
					</div>
				)}
				{!secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.changeNoteLg1}
							title={D.conceptsChangeNote}
							lang={lg1}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.changeNoteLg1}
							title={D.conceptsChangeNote}
							lang={lg1}
							alone={false}
						/>
					</div>
				)}
				{secondLang && (
					<div className="row">
						<ExplanatoryNote
							text={notesVersion1.changeNoteLg2}
							title={D.conceptsChangeNote}
							lang={lg2}
							alone={false}
						/>
						<ExplanatoryNote
							text={notesVersion2.changeNoteLg2}
							title={D.conceptsChangeNote}
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
