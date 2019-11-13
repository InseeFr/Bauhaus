import React from 'react';
import PropTypes from 'prop-types';
import './page-subtitle.scss';

const PageSubtitle = ({ subTitle }) => {
	return (
		<div className="row">
			<div className="col-md-8 centered col-md-offset-2">
				<h3 className="bauhaus-page-subtitle">{subTitle}</h3>
			</div>
		</div>
	);
};

export default PageSubtitle;

PageSubtitle.proptTypes = {
	subtitle: PropTypes.string.isRequired,
};
