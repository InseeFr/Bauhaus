import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import loadIndicator, {
	saveIndicator,
} from 'js/actions/operations/indicators/item';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import { Loading, buildExtract } from '@inseefr/wilco';
import OperationsIndicatorEdition from 'js/applications/operations/indicators/edition/edition';
import { CL_FREQ } from 'js/actions/constants/codeList';

const extractId = buildExtract('id');

const OperationsIndicatorsEditionContainer = (props) => {
	const { indicator, id, loadIndicator } = props;
	useEffect(() => {
		if (!indicator.id && id) {
			loadIndicator(id);
		}
	}, [indicator, id, loadIndicator])

	if (!props.indicator.id && props.id) return <Loading />;
	return <OperationsIndicatorEdition {...props} />;
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
