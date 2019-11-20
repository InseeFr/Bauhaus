import React from 'react';
import {
	getComponentTypeLabel,
	getComponentBackgroundColor,
} from 'js/applications/dsds/utils/components';

export default ({ type }) => {
	const backgroundColor = getComponentBackgroundColor(type);
	return (
		<span
			className={`badge badge-pill`}
			style={{ color: 'white', backgroundColor }}
		>
			{getComponentTypeLabel(type)}
		</span>
	);
};
