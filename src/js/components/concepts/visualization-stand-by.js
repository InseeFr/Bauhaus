import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import { dictionary } from 'js/utils/dictionary';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';

class ConceptVisualizationStandBy extends Component {
	render() {
		const { general } = this.props;
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-10 centered col-md-offset-1">
						<h2 className="page-title">{general.prefLabelLg1}</h2>
					</div>
				</div>
				<div className="row">
					<Button
						action={
							this.props.history.length === 1
								? `/concepts`
								: () => this.props.history.goBack()
						}
						label={dictionary.buttons.return}
					/>
				</div>
				<div className="row">
					<div className="col-md-10 centered col-md-offset-1">
						<h2>{`Le concept est en cours de la validation par ${
							general.creator
						}`}</h2>
					</div>
				</div>
			</div>
		);
	}
}

ConceptVisualizationStandBy.propTypes = {
	general: generalPropTypes,
};

export default withRouter(ConceptVisualizationStandBy);
