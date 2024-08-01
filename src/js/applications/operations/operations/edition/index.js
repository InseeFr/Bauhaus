import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as select from '../../../../reducers';
import { useSelector } from 'react-redux';
import { Loading } from '../../../../new-architecture/components';
import OperationsOperationEdition from '../../../../applications/operations/operations/edition/edition';
import api from '../../../../remote-api/operations-api';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';
import D from '../../../../i18n';
import { useTitle } from '../../../../utils';

const OperationEditionContainer = (props) => {
	const { id } = useParams();
	const [series, setSeries] = useState([]);
	const [operation, setOperation] = useState({});
	const stamp = useSelector((state) => state.app.auth.user.stamp);
	const langs = useSelector((state) => select.getLangs(state));

	const goBack = useGoBack();

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

	useTitle(
		D.operationsTitle,
		operation?.prefLabelLg1 || D.operationsCreateTitle
	);

	if (!operation.id && id) return <Loading />;

	return (
		<OperationsOperationEdition
			series={series}
			langs={langs}
			id={id}
			operation={operation}
			goBack={goBack}
			{...props}
		/>
	);
};

export default OperationEditionContainer;
