import React from 'react';
import PropTypes from 'prop-types';
import './page-subtitle.css';

const PageSubtitle = ({ subTitle, context }) => (
	<div className="row">
		<div className="col-md-8 centered col-md-offset-2">
			<h3 className={`page-subtitle-${context ? context : 'concepts'}`}>
				{subTitle}
			</h3>
		</div>
	</div>
);

export default PageSubtitle;

PageSubtitle.proptTypes = {
	subtitle: PropTypes.string.isRequired,
	context: PropTypes.oneOf(['', 'concepts', 'classifications', 'operations']),
};
