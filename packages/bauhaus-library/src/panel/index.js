import React from 'react';
import PropTypes from 'prop-types';
import Flag from 'flag';
import './panel.scss';

function Panel({ title, children, context = 'concepts', lang }) {
	const flag = <Flag lang={lang} />;
	return (
		<div className={`panel panel-${context}`}>
			<div className="panel-heading">
				<h3 className="panel-title">
					{title} {flag ? '( ' : null} {flag} {flag ? ' )' : null}
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
	lang: PropTypes.string,
};

export default Panel;
