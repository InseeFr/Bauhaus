import React from 'react';
import PropTypes from 'prop-types';
import logoWarning from 'js/applications/shared/logo/logo-warning';
import ModifyNotes from './modify-notes';
import flag from 'js/applications/shared/flag/flag';
import { htmlLength } from 'js/utils/html';

function NoteOneLangEdition({ lang, note, handleChange, maxLength }) {
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
			<label>{flag(lang)}</label>
			<ModifyNotes note={note} handleChange={handleChange} />
			{checkLength}
		</div>
	);
}

NoteOneLangEdition.propTypes = {
	lang: PropTypes.string.isRequired,
	note: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	maxLength: PropTypes.number,
};

export default NoteOneLangEdition;
