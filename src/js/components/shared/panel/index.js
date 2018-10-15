import React from 'react';
import PropTypes from 'prop-types';
import './panel.css';

function Panel({ title, children, context = 'concepts' }) {
	console.log('panel', context);
	return (
		<div className={`panel panel-${context}`}>
			<div className="panel-heading">
				<h3 className="panel-title">{title}</h3>
			</div>
			<div className="panel-body">{children}</div>
		</div>
	);
}

Panel.propTypes = {
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	children: PropTypes.node.isRequired,
	context: PropTypes.oneOf(['', 'concepts', 'classifications', 'operations']),
};

export default Panel;
