import React from 'react';
import PropTypes from 'prop-types';
import logoWarning from 'js/components/shared/logo-warning';
import ConceptModifyNotes from './modify-notes';
import { htmlLength } from 'js/utils/html';

function NoteOneLangEdition({ flag, note, handleChange, maxLength }) {
	const noteLength = htmlLength(note);
	const checkLength = maxLength && (
		<div>
			<div>
				{noteLength} / {maxLength}
			</div>
			<div>{noteLength > maxLength && logoWarning}</div>
		</div>
	);

	return (
		<div className="form-group centered">
			<label>{flag}</label>
			<ConceptModifyNotes note={note} handleChange={handleChange} />
			{checkLength}
		</div>
	);
}

NoteOneLangEdition.propTypes = {
	flag: PropTypes.element.isRequired,
	note: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	maxLength: PropTypes.number,
};

export default NoteOneLangEdition;
