import React from 'react';
import './label-required.scss';

export default ({ children, ...props }) => {
	return (
		<label {...props}>
			{children}
			<span className="boldRed">*</span>
		</label>
	);
};
