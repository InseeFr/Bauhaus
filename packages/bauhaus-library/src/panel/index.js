import React from 'react';
import PropTypes from 'prop-types';
import Flag from '../flag';
import './panel.scss';

const Panel = ({ title, children, context = 'concepts', flag }) => (
	<div className={`panel panel-${context}`}>
		<div className="panel-heading">
			<h3 className="panel-title">
				{title}
				{flag && ` ( `}
				{flag && <Flag flag={flag} />}
				{flag && ` )`}
			</h3>
		</div>
		<div className="panel-body">{children}</div>
	</div>
);

Panel.propTypes = {
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	children: PropTypes.node.isRequired,
	context: PropTypes.oneOf([
		'',
		'concepts',
		'classifications',
		'operations',
		'dsds',
	]),
	flag: PropTypes.string,
};

export default Panel;
