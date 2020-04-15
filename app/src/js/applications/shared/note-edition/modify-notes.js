import React from 'react';
import PropTypes from 'prop-types';
import { EditorHTML } from 'bauhaus-utilities';

function ModifyNotes({ note, handleChange }) {
	return <EditorHTML smart text={note} handleChange={handleChange} />;
}

ModifyNotes.propTypes = {
	note: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
};
export default ModifyNotes;
