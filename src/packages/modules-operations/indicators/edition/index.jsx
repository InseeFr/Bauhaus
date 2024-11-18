import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '@components/loading';
import OperationsIndicatorEdition from '../../../modules-operations/indicators/edition/edition';
import { CL_FREQ } from '../../../redux/actions/constants/codeList';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { useCodesList } from '../../../utils/hooks/codeslist';
import D from '../../../deprecated-locales';
import { useTitle } from '../../../utils/hooks/useTitle';
import { OperationsApi } from '../../../sdk/operations-api';
import { useOrganizations } from '../../../utils/hooks/organizations';

export const Component = (props) => {
	const { id } = useParams();

	const frequencies = useCodesList(CL_FREQ);
	const { data: organisations } = useOrganizations();
	const goBack = useGoBack();

	const [indicator, setIndicator] = useState({});
	const [series, setSeries] = useState([]);

	useEffect(() => {
		if (id) {
			OperationsApi.getIndicatorById(id).then((payload) =>
				setIndicator(payload),
			);
		}
	}, [id]);

	const [indicators, setIndicators] = useState([]);

	useEffect(() => {
		OperationsApi.getAllIndicators().then((payload) => setIndicators(payload));
	}, []);

	useEffect(() => {
		OperationsApi.getSeriesList().then((payload) => setSeries(payload));
	}, []);

	useTitle(D.indicatorsTitle, indicator?.prefLabelLg1);

	if (!indicator.id && id) return <Loading />;

	return (
		<OperationsIndicatorEdition
			series={series}
			indicators={indicators}
			organisations={organisations}
			frequencies={frequencies}
			indicator={indicator}
			goBack={goBack}
			{...props}
		/>
	);
};
