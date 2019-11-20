import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import D from 'js/i18n';

class Controls extends Component {
	render() {
		const location = this.props.history.location.pathname;
		const nexLocation = location.replace('/compare', '');
		return (
			<div className="row btn-line">
				<Button
					label={D.btnReturnCurrent}
					action={nexLocation}
					context="classifications"
					col={3}
				/>
			</div>
		);
	}
}

export default withRouter(Controls);
