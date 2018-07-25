import React from 'react';
import Panel from 'js/components/shared/panel';
import NoteFlag from 'js/components/shared/note-flag';

export const Note = ({ text, title, lang, alone, allowEmpty = false }) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text && !allowEmpty) return null;
	return (
		<div className={cl}>
			<Panel title={<NoteFlag text={title} lang={lang} />}>{text}</Panel>
		</div>
	);
};
