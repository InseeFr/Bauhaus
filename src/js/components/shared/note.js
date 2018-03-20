import React from 'react';
import Panel from 'js/components/shared/panel';
import flag from 'js/components/shared/flag';

export function Note({ text, title, lang, alone }) {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!{ text }) return null;
	return (
		<div className={cl}>
			<Panel title={<NoteFlag text={title} lang={lang} />}>{text}</Panel>
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
