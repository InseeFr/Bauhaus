import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loading } from '../../../components';
import OperationsOperationEdition from '../../../modules-operations/operations/edition/edition';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import D from '../../../deprecated-locales';
import { useTitle } from '../../../utils/hooks/useTitle';
import { OperationsApi } from '../../../sdk/operations-api';
import { useLocales } from '../../../utils/hooks/useLocales';

const OperationEditionContainer = (props) => {
	const { id } = useParams();
	const [series, setSeries] = useState([]);
	const [operation, setOperation] = useState({});
	const stamp = useSelector((state) => state.app.auth.user.stamp);
	const langs = useLocales();

	const goBack = useGoBack();

	useEffect(() => {
		if (id) {
			OperationsApi.getOperation(id).then((result) => {
				setOperation(result);
			});
		}
	}, [id]);

	useEffect(() => {
		OperationsApi.getUserSeriesList(stamp).then((series) => setSeries(series));
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
