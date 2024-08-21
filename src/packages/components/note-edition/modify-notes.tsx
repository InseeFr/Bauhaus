import { EditorHTML } from '../rich-editor';

function ModifyNotes({
	note,
	handleChange,
}: Readonly<{ note: string; handleChange: (value: string) => void }>) {
	return <EditorHTML smart text={note} handleChange={handleChange} />;
}

export default ModifyNotes;
