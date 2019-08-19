import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MenuConcepts from './concepts';
import MenuClassifications from './classifications';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';

class MenuDispatcher extends Component {
	render() {
		const { permission } = this.props;
		const path = this.props.location.pathname;
		let isConceptPath = [
			'/concept',
			'/collection',
			'/concepts/help',
			'/administration',
		].reduce((_, p) => {
			if (path.includes(p)) _ = true;
			return _;
		}, false);
		const isClassificationPath = [
			'/classification',
			'/classifications/help',
		].reduce((_, p) => {
			if (path.includes(p)) _ = true;
			return _;
		}, false);

		return (
			<React.Fragment>
				{isConceptPath && <MenuConcepts permission={permission} />}
				{isClassificationPath && <MenuClassifications />}
			</React.Fragment>
		);
	}
}

MenuDispatcher.propTypes = {
	permission: permissionOverviewPropTypes.isRequired,
};

export default withRouter(MenuDispatcher);
