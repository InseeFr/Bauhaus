import React from 'react';
import PropTypes from 'prop-types';
import './page-title.scss';

/**
 *
 * @param {{title:string, subtitle:string?, col: number?, offset: number?, context:string}} props
 */
function PageTitle({ title, subtitle, col = 10, offset = 1 }) {
	return (
		<div className="row">
			<div className={`col-md-${col} centered col-md-offset-${offset}`}>
				<h1 className="bauhaus-page-title">
					{title}
					{subtitle && <div>&quot; {subtitle} &quot;</div>}
				</h1>
			</div>
		</div>
	);
}

PageTitle.proptTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
};

export default PageTitle;
