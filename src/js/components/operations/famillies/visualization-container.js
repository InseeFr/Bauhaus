// TODO Not really container yet, fix with real data
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import D from 'js/i18n';
import buildExtract from 'js/utils/build-extract';
import { famillies } from './fake-data';
import '../operations.css';

const extractId = buildExtract('id');

class FamilyVisualizationContainer extends Component {
	render() {
		const label = famillies.find(g => g.id === extractId(this.props)).label;
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-10 centered col-md-offset-1">
						<h2 className="page-title-operations">{label}</h2>
					</div>
				</div>
				<div className="row">
					<div className="col-md-2">
						<button
							className="btn btn-primary btn-lg col-md-12"
							onClick={() => this.props.history.goBack()}
						>
							{D.btnReturn}
						</button>
					</div>
				</div>
				<div className="row">
					<h3 className="col-md-10 centered col-md-offset-1">
						{"Qu'affiche-t-on ?"}
					</h3>
				</div>
			</div>
		);
	}
}

export default withRouter(FamilyVisualizationContainer);
