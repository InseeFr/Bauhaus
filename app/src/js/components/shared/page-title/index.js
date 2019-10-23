import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './page-title.scss';
import { ApplicationContext } from 'js/context';

/**
 *
 * @param {{title:string, subtitle:string?, col: number?, offset: number?, context:string}} props
 */
function PageTitle({ title, subtitle, col = 10, offset = 1, context }) {
	const ctx = useContext(ApplicationContext) || context;
	const className = ctx ? `page-title-${ctx}` : 'page-title';
	return (
		<div className="row">
			<div className={`col-md-${col} centered col-md-offset-${offset}`}>
				<h1 className={className}>
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
	context: PropTypes.oneOf(['', 'concepts', 'classifications', 'operations']),
};

export default PageTitle;
