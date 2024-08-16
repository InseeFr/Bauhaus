import { EditorHTML } from '../rich-editor';

function ModifyNotes({ note, handleChange }: { note: any; handleChange: any }) {
	return <EditorHTML smart text={note} handleChange={handleChange} />;
}

export default ModifyNotes;
