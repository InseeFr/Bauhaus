import React from 'react';
import PropTypes from 'prop-types';
import Flag from '../flag';
import './panel.scss';

function Panel({ title, children, context = 'concepts', flag }) {
	const flagComponent = <Flag flag={flag} />;
	return (
		<div className={`panel panel-${context}`}>
			<div className="panel-heading">
				<h3 className="panel-title">
					{title} {flag ? '( ' : null} {flagComponent} {flag ? ' )' : null}
				</h3>
			</div>
			<div className="panel-body">{children}</div>
		</div>
	);
}

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
