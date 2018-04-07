import React from 'react';
import PanelHtml from 'js/components/shared/panel-html';
import NoteFlag from 'js/components/shared/note-flag';

export const ExplanatoryNote = ({ text, title, lang, alone, context }) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text) return null;
	return (
		<div className={cl}>
			<PanelHtml
				title={<NoteFlag text={title} lang={lang} />}
				context={context}
			>
				{text}
			</PanelHtml>
		</div>
	);
};
