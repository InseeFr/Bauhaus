import React from 'react';
import PanelHtml from 'js/components/shared/panel-html';
import NoteFlag from 'js/components/shared/note-flag';

export const ExplanatoryNote = ({ text, title, lang, alone, context }) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text) return <div className={cl} />;
	const newText = text.replace(
		/href="http:\/\/.+?\/codes\/(.+?)\/.+?\/(.+?)"/g,
		`href="${window.location.origin}/classifications/classification/$1/item/$2"`
	);
	return (
		<div className={cl}>
			<PanelHtml
				title={<NoteFlag text={title} lang={lang} />}
				context={context}
			>
				{newText}
			</PanelHtml>
		</div>
	);
};
