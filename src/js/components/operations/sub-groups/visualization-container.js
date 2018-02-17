// TODO Not really container yet, fix with real data
import React, { Component } from 'react';
import { dictionary } from 'js/utils/dictionary';
import '../operations.css';

class SubGroupVisualizationContainer extends Component {
	render() {
		const label = 'toto';
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
							{dictionary.buttons.return}
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

export default SubGroupVisualizationContainer;
