import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import D from 'js/i18n';

class Controls extends Component {
	render() {
		const location = this.props.history.location.pathname;
		const nexLocation = location.replace('/compare', '');
		return (
			<div className="row btn-line">
				<div className="col-md-3">
					<button
						className="btn btn-primary btn-lg col-md-12"
						onClick={() => this.props.history.push(nexLocation)}
					>
						{D.btnReturnCurrent}
					</button>
				</div>
			</div>
		);
	}
}

export default withRouter(Controls);
