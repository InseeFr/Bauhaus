import React from 'react';
import { dictionary } from 'js/utils/dictionary';

export default ({ home }) => (
	<div>
		{home && (
			<div className="centered page-title">
				<h1>{dictionary.app.title}</h1>
			</div>
		)}
		<div className="container centered">
			<h2 className="col-md-6 col-md-offset-3 page-title">Error</h2>
			<h4 className="col-md-8 col-md-offset-2">
				Please contact :DR59-SINL-Equipe-maintenance-RMeS
			</h4>
		</div>
	</div>
);
