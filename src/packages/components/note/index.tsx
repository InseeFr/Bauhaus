import { Panel } from '../panel';

type NoteTypes = {
	text?: string | any;
	title: string;
	alone?: boolean;
	allowEmpty?: boolean;
	alt?: string;
};

export const Note = ({
	text = '',
	title,
	alone,
	allowEmpty = false,
	alt = '',
}: Readonly<NoteTypes>) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text && !allowEmpty) return null;

	return (
		<div className={`${cl}`} title={alt}>
			<Panel title={title}>{text}</Panel>
		</div>
	);
};
