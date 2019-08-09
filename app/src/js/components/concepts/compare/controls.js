import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import D from 'js/i18n';

class Controls extends Component {
	render() {
		const location = this.props.history.location.pathname;
		const nextLocation = location.replace('/compare', '');
		return (
			<div className="row btn-line">
				<Button label={D.btnReturnCurrent} action={nextLocation} col={3} />
			</div>
		);
	}
}

export default withRouter(Controls);
