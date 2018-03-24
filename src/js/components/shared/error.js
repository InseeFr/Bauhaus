import React from 'react';
import D from 'js/i18n';

export default ({ home }) => (
	<div>
		{home && (
			<div className="centered page-title">
				<h1>{D.welcome}</h1>
			</div>
		)}
		<div className="container centered">
			<h2 className="col-md-6 col-md-offset-3 page-title">{D.errorTitle}</h2>
			<h4 className="col-md-8 col-md-offset-2">{D.errorBody}</h4>
		</div>
	</div>
);
