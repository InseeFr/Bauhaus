import React from 'react';
import PropTypes from 'prop-types';
import { dictionary } from 'js/utils/dictionary';
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
						title={dictionary.notes.scopeNote}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={scopeNoteLg2}
							title={dictionary.notes.scopeNote}
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
						title={dictionary.notes.definition}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={definitionLg2}
							title={dictionary.notes.definition}
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
						title={dictionary.notes.editorialeNote}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={editorialNoteLg2}
							title={dictionary.notes.editorialeNote}
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
						title={dictionary.notes.changeNote}
						lang={lg1}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={changeNoteLg2}
							title={dictionary.notes.changeNote}
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
