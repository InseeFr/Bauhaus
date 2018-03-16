import React from 'react';
import Button from 'js/components/shared/button';

export default () => (
	<div className="container">
		<div className="row">
			<h1 className="page-title centered">Page not found</h1>
		</div>
		<div className="row">
			<div className="col-md-5" />
			<Button className="col-md-offset-5" label="Home" action="/" />
		</div>
	</div>
);
