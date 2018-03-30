import React from 'react';
import PropTypes from 'prop-types';

function PageTitle({ title, subtitle, col, offset, context }) {
	const className = context ? `page-title-${context}` : 'page-title';
	return (
		<div className="row">
			<div
				className={`col-md-${col || 10} centered col-md-offset-${
					offset === undefined ? 1 : offset
				}`}
			>
				<h2 className={className}>
					{title}
					{subtitle && <div>&quot; {subtitle} &quot;</div>}
				</h2>
			</div>
		</div>
	);
}

PageTitle.proptTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
};

export default PageTitle;
