import { EditorHTML } from '../../../new-architecture/components';

function ModifyNotes({ note, handleChange }) {
	return <EditorHTML smart text={note} handleChange={handleChange} />;
}

export default ModifyNotes;
