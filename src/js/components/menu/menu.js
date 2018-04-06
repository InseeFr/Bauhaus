import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MenuConcepts from './concepts';
import MenuOperations from './operations';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';

class MenuDispatcher extends Component {
	render() {
		const { permission } = this.props;
		const path = this.props.location.pathname;
		let isConceptPath = [
			'/concept',
			'/collection',
			'/help',
			'/administration',
		].reduce((_, p) => {
			if (path.includes(p)) _ = true;
			return _;
		}, false);
		const isOperationPath = ['/operations'].reduce((_, p) => {
			if (path.includes(p)) _ = true;
			return _;
		}, false);
		return (
			<div>
				{isConceptPath && <MenuConcepts permission={permission} />}
				{isOperationPath && <MenuOperations />}
			</div>
		);
	}
}

MenuDispatcher.propTypes = {
	permission: permissionOverviewPropTypes.isRequired,
};

export default withRouter(MenuDispatcher);
