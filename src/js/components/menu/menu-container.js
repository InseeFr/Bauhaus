import React, { Component } from 'react';
import { connect } from 'react-redux';
import Menu from './menu';

class MenuContainer extends Component {
	render() {
		const { role } = this.props;
		return <Menu role={role} />;
	}
}

const mapStateToProps = state => ({ role: state.app.auth });

export default connect(mapStateToProps)(MenuContainer);
