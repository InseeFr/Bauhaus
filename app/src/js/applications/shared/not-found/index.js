import React from 'react';
import { PageTitle, Button } from '@inseefr/ui';
import D from 'js/i18n';

export default () => (
	<div className="container">
		<PageTitle title={D.notFoundTitle} />
		<div className="row">
			<div className="col-md-5" />
			<Button className="col-md-offset-5" label={D.home} action="/" />
		</div>
	</div>
);
