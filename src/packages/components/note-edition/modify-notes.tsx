import { MDEditor } from '@components/rich-editor/react-md-editor';

function ModifyNotes({
	note,
	handleChange,
}: Readonly<{ note: string; handleChange: (value?: string) => void }>) {
	return <MDEditor text={note} handleChange={handleChange} />;
}

export default ModifyNotes;
