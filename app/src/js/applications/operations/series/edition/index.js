import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import loadSerie, { saveSerie } from 'js/actions/operations/series/item';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import { Loading, buildExtract } from '@inseefr/wilco';
import OperationsSerieEdition from 'js/applications/operations/series/edition/edition';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';
import loadFamiliesList from 'js/actions/operations/families/list';
import { LOADED } from 'js/constants';

const extractId = buildExtract('id');


const OperationsSeriesEditionContainer = props => {
	const { loadFamiliesList, statusFamilies, serie, id, loadSerie } = props;
	useEffect(() => {
		if (statusFamilies !== LOADED) {
			loadFamiliesList();
		}
	}, [loadFamiliesList, statusFamilies])

	useEffect(() => {
		if (!serie.id && id) {
			loadSerie(id);
		}
	}, [loadSerie, id, serie])

	if (!props.serie.id && props.id) return <Loading />;
	return <OperationsSerieEdition {...props} />;

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
	};
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(OperationsSeriesEditionContainer)
);
