import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loading } from '@components/loading';

import { OperationsApi } from '@sdk/operations-api';

import { useCodesList } from '@utils/hooks/codeslist';
import { useOrganizations } from '@utils/hooks/organizations';
import { useGoBack } from '@utils/hooks/useGoBack';
import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales';
import { CL_FREQ } from '../../../redux/actions/constants/codeList';
import OperationsIndicatorEdition from './edition';

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
