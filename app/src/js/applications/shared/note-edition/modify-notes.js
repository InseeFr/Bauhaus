import React from 'react';
import { EditorHTML } from 'js/utils';

function ModifyNotes({ note, handleChange }) {
	return <EditorHTML smart text={note} handleChange={handleChange} />;
}

export default ModifyNotes;
