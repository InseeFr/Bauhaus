import React from 'react';
import { connect } from 'react-redux';
import * as select from 'js/reducers';

export function withPermissions(WrappedComponent) {
	const mapStateToProps = state => {
		const permission = select.getPermission(state);
		return { permission };
	};

	const MenuContainer = props => {
		return <WrappedComponent {...props} />;
	};

	return connect(mapStateToProps)(MenuContainer);
}
