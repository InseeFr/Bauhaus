import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as select from 'js/reducers';
import { useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import OperationsIndicatorEdition from 'js/applications/operations/indicators/edition/edition';
import { CL_FREQ } from 'js/actions/constants/codeList';
import api from '../../../../remote-api/operations-api';
import { useGoBack } from 'js/hooks/hooks';
import { useCodesList } from '../../../../hooks/hooks';

const OperationsIndicatorsEditionContainer = (props) => {
	const { id } = useParams();

	const langs = useSelector((state) => select.getLangs(state));
	const frequencies = useCodesList(CL_FREQ);
	const organisations = useSelector(
		(state) => state.operationsOrganisations.results || []
	);

	const goBack = useGoBack();

	const [indicator, setIndicator] = useState({});
	const [series, setSeries] = useState([]);

	useEffect(() => {
		if (id) {
			api.getIndicator(id).then((payload) => setIndicator(payload));
		}
	}, [id]);

	const [indicators, setIndicators] = useState([]);

	useEffect(() => {
		api.getIndicatorsList().then((payload) => setIndicators(payload));
	}, []);

	useEffect(() => {
		api.getSeriesList().then((payload) => setSeries(payload));
	}, []);

	if (!indicator.id && id) return <Loading />;

	return (
		<OperationsIndicatorEdition
			series={series}
			langs={langs}
			indicators={indicators}
			organisations={organisations}
			frequencies={frequencies}
			indicator={indicator}
			goBack={goBack}
			{...props}
		/>
	);
};

export default OperationsIndicatorsEditionContainer;
