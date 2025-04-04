import Editor, {
	bold,
	italic,
	unorderedListCommand,
} from '@uiw/react-md-editor';

export const MDEditor = ({
	text,
	handleChange,
}: Readonly<{ text?: string; handleChange: (value?: string) => void }>) => {
	return (
		<Editor
			value={text}
			onChange={handleChange}
			commands={[italic, bold, unorderedListCommand]}
			preview="edit"
		/>
	);
};
