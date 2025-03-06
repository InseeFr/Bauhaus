import Editor from '@uiw/react-md-editor';

import { Note } from '../note';

interface ExplanatoryNoteTypes {
	text: string;
	title: string;
	alone?: boolean;
}
export const ExplanatoryNote = ({
	text,
	title,
	alone,
}: Readonly<ExplanatoryNoteTypes>) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text) return <div className={cl} />;

	const newText = text.replace(
		/href="http:\/\/.+?\/codes\/(.+?)\/.+?\/(.+?)"/g,
		`href="${window.location.origin}/classifications/classification/$1/item/$2"`,
	);

	return (
		<Note
			title={title}
			alone={alone}
			text={<Editor.Markdown source={newText} />}
		></Note>
	);
};
