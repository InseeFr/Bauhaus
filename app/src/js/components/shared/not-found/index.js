import React from 'react';
import { PageTitle } from 'bauhaus-library';
import Button from 'js/components/shared/button';
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
