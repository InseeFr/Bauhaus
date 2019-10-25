import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from 'bauhaus-library';
import { Button } from 'bauhaus-library';
import { goBack } from 'js/utils/redirection';
import D from 'js/i18n';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';

class ConceptVisualizationStandBy extends Component {
	render() {
		const {
			general: { prefLabelLg1, creator },
		} = this.props;
		return (
			<div className="container">
				<PageTitle title={prefLabelLg1} />
				<div className="row">
					<Button
						action={goBack(this.props, '/concepts')}
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
