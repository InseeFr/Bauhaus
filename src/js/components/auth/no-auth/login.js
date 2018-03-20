import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import { checkAuth } from 'js/actions/app';

class LoginNoAuth extends Component {
	componentWillMount() {
		this.props.checkAuth();
	}
	render() {
		return <Loading textType="authentification" />;
	}
}

const mapDispatchToProps = {
	checkAuth,
};

export default connect(null, mapDispatchToProps)(LoginNoAuth);
