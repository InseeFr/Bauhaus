import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, ActionToolbar } from '@inseefr/ui';
import D from 'js/i18n';

class Controls extends Component {
	render() {
		const location = this.props.history.location.pathname;
		const nextLocation = location.replace('/compare', '');
		return (
			<ActionToolbar>
				<Button label={D.btnReturnCurrent} action={nextLocation} col={3} />
			</ActionToolbar>
		);
	}
}

export default withRouter(Controls);
