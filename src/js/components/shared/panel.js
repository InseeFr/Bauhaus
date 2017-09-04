import React from 'react';
import PropTypes from 'prop-types';
import './panel-concepts.css';

function Panel({ title, children }) {
	return (
		<div className="panel panel-concepts">
			<div className="panel-heading">
				<h3 className="panel-title">
					{title}
				</h3>
			</div>
			<div className="panel-body">
				{children}
			</div>
		</div>
	);
}

Panel.propTypes = {
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	children: PropTypes.node.isRequired,
};

export default Panel;
