import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import 'babel-polyfill';
import { footer } from 'config';

class Root extends Component {
	render() {
		const { error } = this.props;
		return (
			<div>
				<Router>
					<Routes error={error} />
				</Router>
				<div className="centered" style={{ marginTop: '50px' }}>
					<label>{footer}</label>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	const error = state.app.error;
	return { error };
};

export default connect(mapStateToProps)(Root);
