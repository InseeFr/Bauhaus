import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import { dictionary } from 'js/utils/dictionary';
import { checkAuth } from 'js/actions/app';

// TODO
class LoginOpenIDConnect extends Component {
	componentWillMount() {
		this.props.checkAuth();
	}
	render() {
		return (
			<Loadable
				active={true}
				spinner
				text={dictionary.loadable.loading}
				color="#457DBB"
				background="grey"
				spinnerSize="400px"
			/>
		);
	}
}

const mapDispatchToProps = {
	checkAuth,
};

export default connect(null, mapDispatchToProps)(LoginOpenIDConnect);
