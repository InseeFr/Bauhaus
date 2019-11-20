import React from 'react';
import { PageTitle } from 'bauhaus-library';
import D from 'js/i18n';

export default ({ home }) => (
	<div>
		{home && (
			<div className="centered page-title">
				<h1>{D.welcome}</h1>
			</div>
		)}
		<div className="container centered">
			<PageTitle title={D.errorTitle} col={6} offset={3} />
			<h4 className="col-md-8 col-md-offset-2">{D.errorBody}</h4>
		</div>
	</div>
);
