import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import 'babel-polyfill';
import { footer } from 'config';

export default () => (
	<div>
		<Router>
			<Routes />
		</Router>
		<div className="centered" style={{ marginTop: '50px' }}>
			<label>{footer}</label>
		</div>
	</div>
);
