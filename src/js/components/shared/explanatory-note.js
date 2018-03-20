import React from 'react';
import PanelHtml from 'js/components/shared/panel-html';
import flag from 'js/components/shared/flag';

export function ExplanatoryNote({ text, title, lang, alone }) {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!{ text }) return null;
	return (
		<div className={cl}>
			<PanelHtml title={<NoteFlag text={title} lang={lang} />}>
				{text}
			</PanelHtml>
		</div>
	);
}

function NoteFlag({ text, lang }) {
	return (
		<div>
			{text + '  ( '}
			{flag(lang)} )
		</div>
	);
}
