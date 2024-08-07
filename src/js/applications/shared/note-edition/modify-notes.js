import { EditorHTML } from '../../../utils';

function ModifyNotes({ note, handleChange }) {
	return <EditorHTML smart text={note} handleChange={handleChange} />;
}

export default ModifyNotes;
