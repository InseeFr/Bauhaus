import React from 'react';
import PropTypes from 'prop-types';
import EditorHtml from 'js/components/shared/editor-html';

function ModifyNotes({ note, handleChange }) {
	return <EditorHtml smart text={note} handleChange={handleChange} />;
}

ModifyNotes.propTypes = {
	note: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
};
export default ModifyNotes;
