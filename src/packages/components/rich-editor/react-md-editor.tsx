import Editor, {
	bold,
	italic,
	unorderedListCommand,
} from '@uiw/react-md-editor';
import { ComponentProps } from 'react';

export const MDEditor = ({
	text,
	handleChange,
	...props
}: Readonly<
	{
		text?: string;
		handleChange: (value?: string) => void;
	} & Omit<
		ComponentProps<typeof Editor>,
		'value' | 'onChange' | 'commands' | 'preview'
	>
>) => {
	return (
		<Editor
			{...props}
			value={text}
			onChange={handleChange}
			commands={[italic, bold, unorderedListCommand]}
			preview="edit"
		/>
	);
};
