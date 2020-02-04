import React from 'react';
import PageTitle from '../page-title';
import D from '../build-dictionary';
export default ({ home }) => {
	return (
		<div>
			{home && <h1 className="centered page-title">{D.welcome}</h1>}
			<div className="container centered">
				<PageTitle title={D.errorTitle} col={6} offset={3} />
				<p className="col-md-8 col-md-offset-2">{D.errorBody}</p>
			</div>
		</div>
	);
};
