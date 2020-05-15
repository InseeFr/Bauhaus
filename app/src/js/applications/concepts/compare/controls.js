import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ReturnButton, ActionToolbar } from '@inseefr/wilco';

class Controls extends Component {
	render() {
		const location = this.props.history.location.pathname;
		const nextLocation = location.replace('/compare', '');
		return (
			<ActionToolbar>
				<ReturnButton action={nextLocation} col={3} />
			</ActionToolbar>
		);
	}
}

export default withRouter(Controls);
