import React from 'react';
import Button from 'js/components/shared/button';
import D from 'js/i18n';

export default () => (
	<div className="container">
		<div className="row">
			<h1 className="page-title centered">{D.notFoundTitle}</h1>
		</div>
		<div className="row">
			<div className="col-md-5" />
			<Button className="col-md-offset-5" label={D.home} action="/" />
		</div>
	</div>
);
