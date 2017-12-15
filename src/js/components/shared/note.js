import React from 'react';
import Panel from 'js/components/shared/panel';
import fr from 'img/fr.png';
import en from 'img/en.png';

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
	const img = lang === 'fr' ? fr : en;
	return (
		<div>
			{text + '  ( '}
			<img src={img} alt="fr" className="img-flag" /> )
		</div>
	);
}
