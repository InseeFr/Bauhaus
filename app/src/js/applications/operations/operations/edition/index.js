import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as select from 'js/reducers';
import { useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import OperationsOperationEdition from 'js/applications/operations/operations/edition/edition';
import api from 'js/remote-api/operations-api';
import { useRedirectWithDefault } from 'bauhaus-utilities';

const OperationEditionContainer = (props) => {
	const goBack = useRedirectWithDefault();
	const goBackOrReplace = useRedirectWithDefault(undefined, true);

	const { id } = useParams();
	const [series, setSeries] = useState([]);
	const [operation, setOperation] = useState({});
	const stamp = useSelector((state) => state.app.auth.user.stamp);
	const langs = useSelector((state) => select.getLangs(state));

	useEffect(() => {
		if (id) {
			api.getOperation(id).then((result) => {
				setOperation(result);
			});
		}
	}, [id]);

	useEffect(() => {
		api.getUserSeriesList(stamp).then((series) => setSeries(series));
	}, [stamp]);

	if (!operation.id && id) return <Loading />;

	return (
		<OperationsOperationEdition
			series={series}
			langs={langs}
			id={id}
			operation={operation}
			goBackOrReplace={(url, shouldReplace) => shouldReplace ? goBackOrReplace(url) : goBack(url)}
			{...props}
		/>
	);
};

export default OperationEditionContainer;
