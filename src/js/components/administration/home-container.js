import React, { Component } from 'react';
import { connect } from 'react-redux';
import AdministrationHome from './home';
import * as select from 'js/reducers';

class AdminHomeContainer extends Component {
	render() {
		const { permission } = this.props;
		return <AdministrationHome permission={permission} />;
	}
}

const mapStateToProps = state => {
	const permission = select.getPermission(state);
	return { permission };
};

export default connect(mapStateToProps)(AdminHomeContainer);
