import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadSerie, { saveSerie } from 'js/actions/operations/series/item';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import buildExtract from 'bauhaus-library/src/utils/build-extract';
import { Loading } from 'bauhaus-library';
import OperationsSerieEdition from 'js/applications/operations/series/edition/edition';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';
import loadFamiliesList from 'js/actions/operations/families/list';
import { LOADED } from 'js/constants';

const extractId = buildExtract('id');

class OperationsSeriesEditionContainer extends Component {
	componentWillMount() {
		if (!this.props.statusFamilies !== LOADED) {
			this.props.loadFamiliesList();
		}
		if (!this.props.serie.id && this.props.id) {
			this.props.loadSerie(this.props.id);
		}
	}
	render() {
		if (!this.props.serie) return <Loading />;
		return <OperationsSerieEdition {...this.props} />;
	}
}

const mapDispatchToProps = {
	loadSerie,
	saveSerie,
	loadFamiliesList,
};

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const serie = id ? select.getSerie(state) : {};
	const langs = select.getLangs(state);
	const categories =
		state.operationsCodesList.results[CL_SOURCE_CATEGORY] || {};
	const frequencies = state.operationsCodesList.results[CL_FREQ] || {};
	const { results: families = [], status: statusFamilies } = select.getFamilies(
		state
	);
	return {
		id,
		serie,
		langs,
		categories,
		frequencies,
		operationsAsyncTask: state.operationsAsyncTask,
		organisations: state.operationsOrganisations.results,
		indicators: state.operationsIndicatorsList.results || [],
		series: state.operationsSeriesList.results || [],
		families,
		statusFamilies,
		stamps: select.getStampList(state) || [],
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(OperationsSeriesEditionContainer)
);
