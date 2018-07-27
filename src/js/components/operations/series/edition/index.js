import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadSerie, { saveSerie } from 'js/actions/operations/series/item';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import buildExtract from 'js/utils/build-extract';
import Loading from 'js/components/shared/loading';
import OperationsSerieEdition from 'js/components/operations/series/edition/edition';
import loadCodesList from 'js/actions/operations/series/codesList';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';

const extractId = buildExtract('id');

class OperationsSeriesEditionContainer extends Component {
	componentWillMount() {
		if (!this.props.serie.id) {
			this.props.loadSerie(this.props.id);
			this.props.loadCodesList(CL_SOURCE_CATEGORY);
			this.props.loadCodesList(CL_FREQ);
		}
	}
	render() {
		if (!this.props.serie)
			return <Loading textType="loading" context="operations" />;
		return <OperationsSerieEdition {...this.props} />;
	}
}

const mapDispatchToProps = {
	loadSerie,
	saveSerie,
	loadCodesList,
};

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const serie = select.getSerie(state, id);
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
	};
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(OperationsSeriesEditionContainer)
);
