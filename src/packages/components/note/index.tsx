import { Panel } from '../panel';

interface NoteTypes {
	text?: string | any;
	title: string;
	alone?: boolean;
	allowEmpty?: boolean;
	alt?: string;
}

export const Note = ({
	text = '',
	title,
	alone,
	allowEmpty = false,
	alt = '',
}: Readonly<NoteTypes>) => {
	if (!text && !allowEmpty) return null;
	const cl = alone ? 'col-md-12' : 'col-md-6';

	return (
		<div className={`note ${cl}`} title={alt}>
			<Panel title={title}>{text}</Panel>
		</div>
	);
};
