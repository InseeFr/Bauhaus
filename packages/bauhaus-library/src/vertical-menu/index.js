import React from 'react';
import './style.scss';

export default ({ children = [] }) => {
	const buttons = Array.isArray(children) ? children : [children];
	return (
		<div className="col-md-3 btn-group-vertical">
			{buttons.map(child => (
				<div className="row">
					<div className="col-md-12">{child}</div>
				</div>
			))}
		</div>
	);
};
