import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MenuConcepts from './concepts';
import MenuOperations from './operations';

class MenuDispatcher extends Component {
	render() {
		const { role } = this.props;
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
		const isOperationPath = ['/group', '/sub-group', '/study-unit'].reduce(
			(_, p) => {
				if (path.includes(p)) _ = true;
				return _;
			},
			false
		);
		return (
			<div>
				{isConceptPath && <MenuConcepts role={role} />}
				{isOperationPath && <MenuOperations />}
			</div>
		);
	}
}

export default withRouter(MenuDispatcher);
