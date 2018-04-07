import React from 'react';
import './page-subtitle.css';

export default ({ subTitle, context }) => (
	<div className="row">
		<div className="col-md-8 centered col-md-offset-2">
			<h3 className={`page-subtitle-${context ? context : 'concepts'}`}>
				{subTitle}
			</h3>
		</div>
	</div>
);
