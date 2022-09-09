import React from 'react';
import { Note } from '@inseefr/wilco';
import DOMPurify from 'dompurify';
import { HTMLUtils } from 'bauhaus-utilities';

export const ExplanatoryNote = ({ text, title, alone, md }) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text) return <div className={cl} />;

	const newText = (md ? HTMLUtils.markdownToHtml(text) : text).replace(
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
