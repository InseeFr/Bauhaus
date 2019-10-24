import React, { useContext } from 'react';
import Panel from '../panel';
import { markdownToHtml } from 'js/utils/html';
import { ThemeContext } from 'bauhaus-library';

export default ({
	text = '',
	title,
	alone,
	allowEmpty = false,
	md = false,
	context,
	alt = '',
}) => {
	const ctx = useContext(ThemeContext) || context;
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text && !allowEmpty) return null;

	let body = text;
	if (md) {
		body = <div dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }} />;
	}
	return (
		<div className={`note-${ctx} ${cl}`} title={alt}>
			<Panel title={title} context={ctx}>
				{body}
			</Panel>
		</div>
	);
};
