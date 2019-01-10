import React from 'react';
import PropTypes from 'prop-types';

export default function MSDItemLayout({ title, children }) {
	return (
		<article className="panel panel-default contenu">
			<div className="panel-heading">
				<h3>{title}</h3>
			</div>
			<div className="panel-body">{children}</div>
		</article>
	);
}

MSDItemLayout.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.object.isRequired,
};
