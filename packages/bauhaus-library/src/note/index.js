import React from 'react';
import Panel from '../panel';
import { markdownToHtml } from 'js/utils/html';

export default ({
	text = '',
	title,
	alone,
	allowEmpty = false,
	md = false,
	alt = '',
}) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text && !allowEmpty) return null;

	let body = text;
	if (md) {
		body = <div dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }} />;
	}
	return (
		<div className={`bauhaus-note ${cl}`} title={alt}>
			<Panel title={title}>{body}</Panel>
		</div>
	);
};
