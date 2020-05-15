import React from 'react';
import PropTypes from 'prop-types';
import { LogoWarning } from '@inseefr/wilco';
import ModifyNotes from './modify-notes';
import flag from 'js/applications/shared/flag/flag';
import { HTMLUtils } from 'bauhaus-utilities';

function NoteOneLangEdition({ lang, note, handleChange, maxLength }) {
	const noteLength = HTMLUtils.htmlLength(note);
	const checkLength = maxLength && (
		<div>
			<div>
				{noteLength} / {maxLength}
			</div>
			<div>{noteLength > maxLength && LogoWarning}</div>
		</div>
	);

	return (
		<div className="form-group text-center">
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
