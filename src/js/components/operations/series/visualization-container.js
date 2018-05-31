// TODO Not really container yet, fix with real data
import React, { Component } from 'react';
import PageTitle from 'js/components/shared/page-title';
import { goBack } from 'js/utils/redirection';
import D from 'js/i18n';
import '../operations.css';

class SeriesVisualizationContainer extends Component {
	render() {
		const label = 'toto';
		return (
			<div className="container">
				<PageTitle title={label} context="operations" />
				<div className="row">
					<div className="col-md-2">
						<button
							className="btn btn-primary btn-lg col-md-12"
							onClick={goBack(this.props, '/operations/series')}
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

export default SeriesVisualizationContainer;
