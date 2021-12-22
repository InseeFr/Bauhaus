import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import loadSerie, { saveSerie } from 'js/actions/operations/series/item';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import { Loading, buildExtract } from '@inseefr/wilco';
import OperationsSerieEdition from 'js/applications/operations/series/edition/edition';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';
import api from '../../../../remote-api/operations-api';

const extractId = buildExtract('id');


const OperationsSeriesEditionContainer = props => {
	const { serie, id, loadSerie } = props;
	const [families, setFamilies] = useState([]);
	const [indicators, setIndicators] = useState([]);

	useEffect(() => {
		api.getFamiliesList()
			.then(results => setFamilies(results))
	}, [])
	useEffect(() => {
		api.getIndicatorsList()
			.then(results => setIndicators(results))
	}, [])

	useEffect(() => {
		if (!serie.id && id) {
			loadSerie(id);
		}
	}, [loadSerie, id, serie])

	if (!props.serie.id && props.id) return <Loading />;
	return <OperationsSerieEdition {...props} families={families} indicators={indicators}/>;

}

const mapDispatchToProps = {
	loadSerie,
	saveSerie,
};

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const serie = id ? select.getSerie(state) : {};
	const langs = select.getLangs(state);
	const categories =
		state.operationsCodesList.results[CL_SOURCE_CATEGORY] || {};
	const frequencies = state.operationsCodesList.results[CL_FREQ] || {};

	return {
		id,
		serie,
		langs,
		categories,
		frequencies,
		operationsAsyncTask: state.operationsAsyncTask,
		organisations: state.operationsOrganisations.results,
		series: state.operationsSeriesList.results || [],
	};
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(OperationsSeriesEditionContainer)
);
