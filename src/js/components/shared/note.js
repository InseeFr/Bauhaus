import React from 'react';
import Panel from 'js/components/shared/panel';
import NoteFlag from 'js/components/shared/note-flag';
import { markdownToHtml } from 'js/utils/html';

export const Note = ({
	text,
	title,
	lang,
	alone,
	allowEmpty = false,
	md = false,
	context,
}) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text && !allowEmpty) return null;

	if (md) {
		return (
			<div className={cl}>
				<Panel title={<NoteFlag text={title} lang={lang} />} context={context}>
					<div dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }} />
				</Panel>
			</div>
		);
	}
	return (
		<div className={cl}>
			<Panel title={<NoteFlag text={title} lang={lang} />} context={context}>
				{text}
			</Panel>
		</div>
	);
};
