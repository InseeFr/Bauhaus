import React from 'react';
import { Note } from '@inseefr/ui';
import DOMPurify from 'dompurify';

export const ExplanatoryNote = ({ text, title, alone }) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text) return <div className={cl} />;
	const newText = text.replace(
		/href="http:\/\/.+?\/codes\/(.+?)\/.+?\/(.+?)"/g,
		`href="${window.location.origin}/classifications/classification/$1/item/$2"`
	);
	return (
		<Note
			title={title}
			alone={alone}
			text={
				<div
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(newText),
					}}
				/>
			}
		></Note>
	);
};
