import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import bauhausLogo from 'img/logo_noir.svg';

import 'react-app-polyfill/stable';

class Root extends Component {
	render() {
		const footer = `${process.env.REACT_APP_NAME} - ${process.env.REACT_APP_VERSION}`;
		return (
			<>
				<div id="root-app">
					<Router>
						<Routes />
					</Router>
				</div>
				<footer className="text-center" style={{ marginTop: '50px' }}>
					<p>
						<img width="100" src={bauhausLogo} alt="application logo" />

						{footer}
					</p>
				</footer>
			</>
		);
	}
}

const mapStateToProps = state => {
	const error = state.app.error;
	return { error };
};

export default connect(mapStateToProps)(Root);
