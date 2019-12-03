import React, { useContext } from 'react';
import PageTitle from '../page-title';
import { I18NContext } from '../context';

export default ({ home }) => {
	const D = useContext(I18NContext);

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
