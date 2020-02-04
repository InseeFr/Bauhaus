import React from 'react';
import Panel from '../panel';

export default ({ text = '', title, alone, allowEmpty = false, alt = '' }) => {
	const cl = alone ? 'col-md-12' : 'col-md-6';
	if (!text && !allowEmpty) return null;

	return (
		<div className={`bauhaus-note ${cl}`} title={alt}>
			<Panel title={title}>{text}</Panel>
		</div>
	);
};
