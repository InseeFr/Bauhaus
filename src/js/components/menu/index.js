import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MenuConcepts from './concepts';

class MenuDispatcher extends Component {
	render() {
		const path = this.props.location.pathname;
		const isConceptPath = [
			'/concept',
			'/collection',
			'/help',
			'/administration',
		].reduce((_, p) => {
			if (path.includes(p)) _ = true;
			return _;
		}, false);
		return <div>{isConceptPath && <MenuConcepts />}</div>;
	}
}

export default withRouter(MenuDispatcher);
