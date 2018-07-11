import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadSerie, { saveSerie } from 'js/actions/operations/series/item';
import { saveSecondLang } from 'js/actions/app';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import buildExtract from 'js/utils/build-extract';
import Loading from 'js/components/shared/loading';
import OperationsSerieEdition from 'js/components/operations/series/edition/edition';

const extractId = buildExtract('id');

class OperationsSeriesEditionContainer extends Component {
	componentWillMount() {
		if (!this.props.serie.id) {
			this.props.loadSerie(this.props.id);
		}
	}
	render() {
		if (!this.props.serie)
			return <Loading textType="loading" context="operations" />;
		return <OperationsSerieEdition {...this.props} />;
	}
}

const mapDispatchToProps = {
	saveSecondLang,
	loadSerie,
	saveSerie,
};

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const serie = select.getSerie(state, id);
	const secondLang = state.app.secondLang;
	const langs = select.getLangs(state);
	return {
		id,
		serie,
		secondLang,
		langs,
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(OperationsSeriesEditionContainer)
);
