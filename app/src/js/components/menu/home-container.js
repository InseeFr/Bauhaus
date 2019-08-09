import React, { Component } from 'react';
import { connect } from 'react-redux';
import Menu from './home';
import * as select from 'js/reducers';

class MenuContainer extends Component {
	render() {
		const { permission } = this.props;
		return <Menu permission={permission} />;
	}
}

const mapStateToProps = state => {
	const permission = select.getPermission(state);
	return { permission };
};

export default connect(mapStateToProps)(MenuContainer);
