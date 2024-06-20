import React from 'react';
import { connect } from 'react-redux';
import { Auth } from 'js/utils';

export function withPermissions(WrappedComponent) {
	const mapStateToProps = (state) => {
		const permission = Auth.getPermission(state);
		return { permission };
	};

	const MenuContainer = (props) => {
		return <WrappedComponent {...props} />;
	};

	return connect(mapStateToProps)(MenuContainer);
}
