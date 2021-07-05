import React, {useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import loadOperation, {
	saveOperation,
} from 'js/actions/operations/operations/item';
import * as select from 'js/reducers';
import { connect, useSelector } from 'react-redux';
import { Loading, buildExtract } from '@inseefr/wilco';
import OperationsOperationEdition from 'js/applications/operations/operations/edition/edition';
import api  from 'js/remote-api/operations-api';

const extractId = buildExtract('id');

const OperationEditionContainer = (props) => {
	const [series, setSeries] = useState([]);
	const stamp = useSelector(state => state.app.auth.user.stamp);
	const { loadOperation, id, operation} = props;

	useEffect(() => {
		if (!operation.id && id) {
			loadOperation(id);
		}
	}, [operation.id, id, loadOperation]);

	useEffect(() => {
		api.getUserSeriesList(stamp).then(series => setSeries(series))
	}, [stamp])

	if (!operation.id && id) return <Loading />;

	return <OperationsOperationEdition series={series} {...props} />;
}


const mapDispatchToProps = {
	loadOperation,
	saveOperation,
};

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const operation = id ? select.getOperation(state, id) : {};
	const langs = select.getLangs(state);
	return {
		id,
		operation,
		langs,
		operationsAsyncTask: state.operationsAsyncTask,
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(OperationEditionContainer)
);
