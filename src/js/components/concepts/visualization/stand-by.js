import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PageTitle from 'js/components/shared/page-title';
import Button from 'js/components/shared/button';
import D from 'js/i18n';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';

class ConceptVisualizationStandBy extends Component {
	render() {
		const { general: { prefLabelLg1, creator } } = this.props;
		return (
			<div className="container">
				<PageTitle title={prefLabelLg1} />
				<div className="row">
					<Button
						action={
							this.props.history.length === 1
								? `/concepts`
								: () => this.props.history.goBack()
						}
						label={D.btnReturn}
					/>
				</div>
				<div className="row">
					<div className="col-md-10 centered col-md-offset-1">
						<h2>
							{D.conceptStandBy} {creator}
						</h2>
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
