import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n'
import { ExplanatoryNote } from 'js/components/shared/explanatory-note';
import 'css/concept-notes.css';

function ConceptNotes({ secondLang, notes, langs }) {
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
	const { lg1, lg2 } = langs;
	return (
		<div>
			{scopeNoteLg1 && (
				<div className="row">
					<ExplanatoryNote
						text={scopeNoteLg1}
						title={D.conceptsScopeNote}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={scopeNoteLg2}
							title={D.conceptsScopeNote}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{definitionLg1 && (
				<div className="row">
					<ExplanatoryNote
						text={definitionLg1}
						title={D.conceptsDefinition}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={definitionLg2}
							title={D.conceptsDefinition}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{editorialNoteLg1 && (
				<div className="row">
					<ExplanatoryNote
						text={editorialNoteLg1}
						title={D.conceptsEditorialNote}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={editorialNoteLg2}
							title={D.conceptsEditorialNote}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
			{changeNoteLg1 && (
				<div className="row">
					<ExplanatoryNote
						text={changeNoteLg1}
						title={D.conceptsChangeNote}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={changeNoteLg2}
							title={D.conceptsChangeNote}
							lang={lg2}
							alone={false}
						/>
					)}
				</div>
			)}
		</div>
	);
}

ConceptNotes.propTypes = {
	secondLang: PropTypes.bool.isRequired,
	notes: PropTypes.object.isRequired,
};
export default ConceptNotes;
