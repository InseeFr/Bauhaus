import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadIndicator, {
	saveIndicator,
} from 'js/actions/operations/indicators/item';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import buildExtract from 'js/utils/build-extract';
import Loading from 'js/components/shared/loading';
import OperationsIndicatorEdition from 'js/components/operations/indicators/edition/edition';
import { CL_FREQ } from 'js/actions/constants/codeList';

const extractId = buildExtract('id');

class OperationsIndicatorsEditionContainer extends Component {
	componentWillMount() {
		if (!this.props.indicator.id && this.props.id) {
			this.props.loadIndicator(this.props.id);
		}
	}
	render() {
		if (!this.props.indicator)
			return <Loading textType="loading" context="operations" />;

		return <OperationsIndicatorEdition {...this.props} />;
	}
}

const mapDispatchToProps = {
	loadIndicator,
	saveIndicator,
};

export const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps) || '';
	const indicator = id ? select.getIndicator(state) : {};
	const langs = select.getLangs(state);
	const frequencies = state.operationsCodesList.results[CL_FREQ] || {};
	return {
		id,
		indicator,
		langs,
		frequencies,
		operationsAsyncTask: state.operationsAsyncTask,
		organisations: state.operationsOrganisations.results,
		indicators: state.operationsIndicatorsList.results || [],
		series: state.operationsSeriesList.results || [],
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(OperationsIndicatorsEditionContainer)
);
