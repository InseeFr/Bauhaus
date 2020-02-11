import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadOperation, {
	saveOperation,
} from 'js/actions/operations/operations/item';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import buildExtract from '@inseefr/ui/src/utils/build-extract';
import { Loading } from '@inseefr/ui';
import OperationsOperationEdition from 'js/applications/operations/operations/edition/edition';
import loadSeriesList from 'js/actions/operations/series/list';
import { LOADED } from 'js/constants';

const extractId = buildExtract('id');

class OperationEditionContainer extends Component {
	componentDidMount() {
		if (!this.props.statusSeries !== LOADED) {
			this.props.loadSeriesList();
		}
		if (!this.props.operation.id && this.props.id) {
			this.props.loadOperation(this.props.id);
		}
	}
	render() {
		if (!this.props.operation) return <Loading />;
		return <OperationsOperationEdition {...this.props} />;
	}
}

const mapDispatchToProps = {
	loadOperation,
	saveOperation,
	loadSeriesList,
};

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const operation = id ? select.getOperation(state, id) : {};
	const { results: series = [], status: statusSeries } = select.getSeries(
		state
	);
	const langs = select.getLangs(state);
	return {
		id,
		operation,
		langs,
		series,
		statusSeries,
		operationsAsyncTask: state.operationsAsyncTask,
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(OperationEditionContainer)
);
