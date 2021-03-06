import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { goBack, PageTitle, ReturnButton } from '@inseefr/wilco';
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
					<ReturnButton action={goBack(this.props, '/concepts')} />
				</div>
				<div className="row">
					<div className="col-md-10 text-center col-md-offset-1">
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
