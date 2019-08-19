import React from 'react';
import { connect } from 'react-redux';
import * as select from 'js/reducers';

export function withPermissions(WrappedComponent) {
	const mapStateToProps = state => {
		const permission = select.getPermission(state);
		return { permission };
	};

	class MenuContainer extends React.Component {
		render() {
			return (
				<WrappedComponent
					permissions={this.props.permissions}
					{...this.props}
				/>
			);
		}
	}

	return connect(mapStateToProps)(MenuContainer);
}
