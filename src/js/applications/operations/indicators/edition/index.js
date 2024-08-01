import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as select from '../../../../reducers';
import { useSelector } from 'react-redux';
import { Loading } from '../../../../new-architecture/components';
import OperationsIndicatorEdition from '../../../../applications/operations/indicators/edition/edition';
import { CL_FREQ } from '../../../../actions/constants/codeList';
import api from '../../../../remote-api/operations-api';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';
import { useCodesList } from '../../../../hooks/hooks';
import D from '../../../../i18n';
import { useTitle } from '../../../../utils';

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
			api.getIndicatorById(id).then((payload) => setIndicator(payload));
		}
	}, [id]);

	const [indicators, setIndicators] = useState([]);

	useEffect(() => {
		api.getAllIndicators().then((payload) => setIndicators(payload));
	}, []);

	useEffect(() => {
		api.getSeriesList().then((payload) => setSeries(payload));
	}, []);

	useTitle(
		D.indicatorsTitle,
		indicator?.prefLabelLg1 || D.indicatorsCreateTitle
	);

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
