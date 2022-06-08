import React from 'react';
import PageTitle from '../page-title';
import D from '../build-dictionary';

export default ({ home }) => {
	return (
		<div>
			{home && <h1 className="text-center page-title">{D.welcome}</h1>}
			<div className="container">
				<PageTitle title={D.errorTitle} col={6} />
				<p className="text-center">{D.errorBody}</p>
			</div>
		</div>
	);
};
