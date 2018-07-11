import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadOperation, {
	saveOperation,
} from 'js/actions/operations/operations/item';
import { saveSecondLang } from 'js/actions/app';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import buildExtract from 'js/utils/build-extract';
import Loading from 'js/components/shared/loading';
import OperationsOperationEdition from 'js/components/operations/operations/edition/edition';

const extractId = buildExtract('id');

class OperationEditionContainer extends Component {
	componentWillMount() {
		if (!this.props.operation.id) {
			this.props.loadOperation(this.props.id);
		}
	}
	render() {
		if (!this.props.operation)
			return <Loading textType="loading" context="operations" />;
		return <OperationsOperationEdition {...this.props} />;
	}
}

const mapDispatchToProps = {
	saveSecondLang,
	loadOperation,
	saveOperation,
};

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const operation = select.getOperation(state, id);
	const secondLang = state.app.secondLang;
	const langs = select.getLangs(state);
	return {
		id,
		operation,
		secondLang,
		langs,
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(OperationEditionContainer)
);
