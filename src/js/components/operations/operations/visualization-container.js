// TODO Not really container yet, fix with real data
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import buildExtract from 'js/utils/build-extract';
import { operations } from './fake-data';
import '../operations.css';

const extractId = buildExtract('id');

class OperationVisualizationContainer extends Component {
	render() {
		const label = operations.find(g => g.id === extractId(this.props)).label;
		return (
			<div className="container">
				<PageTitle title={label} context="operations" />
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

export default withRouter(OperationVisualizationContainer);
