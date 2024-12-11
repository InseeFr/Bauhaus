import Editor from '@uiw/react-md-editor';

export const MDEditor = ({
	text,
	handleChange,
}: Readonly<{ text: string; handleChange: (value?: string) => void }>) => {
	return (
		<Editor value={text} onChange={handleChange} commands={[]} preview="edit" />
	);
};
