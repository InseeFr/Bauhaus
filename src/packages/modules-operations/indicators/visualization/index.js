import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import D from '../../../deprecated-locales';
import { useSelector } from 'react-redux';
import OperationsIndicatorVisualization from '../../../modules-operations/indicators/visualization/general';
import {
	Loading,
	ErrorBloc,
	PageTitleBlock,
	CheckSecondLang,
} from '../../../components';

import { CL_FREQ } from '../../../redux/actions/constants/codeList';
import { useCodesList } from '../../../utils/hooks/codeslist';
import { getLocales } from '../../../redux/selectors';
import { getSecondLang } from '../../../redux/second-lang';
import { OperationsApi } from '../../../sdk/operations-api';
import { Menu } from './menu';
const IndicatorVisualizationContainer = () => {
	const { id } = useParams();

	const langs = useSelector((state) => getLocales(state));
	const secondLang = useSelector((state) => getSecondLang(state));
	const frequency = useCodesList(CL_FREQ);
	const organisations = useSelector(
		(state) => state.operationsOrganisations.results || []
	);

	const [indicator, setIndicator] = useState({});

	const [serverSideError, setServerSideError] = useState();
	const [publishing, setPublishing] = useState(false);

	const publish = useCallback(() => {
		setPublishing(true);
		OperationsApi.publishIndicator(indicator)
			.then(() => {
				return OperationsApi.getIndicatorById(id).then(setIndicator);
			})
			.catch((error) => setServerSideError(error))
			.finally(() => setPublishing(false));
	}, [indicator, id]);

	useEffect(() => {
		OperationsApi.getIndicatorById(id).then((payload) => setIndicator(payload));
	}, [id]);

	if (!indicator.id) return <Loading />;
	if (publishing) return <Loading text={'publishing'} />;

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={indicator.prefLabelLg1}
				titleLg2={indicator.prefLabelLg2}
				secondLang={secondLang}
			/>
			<Menu indicator={indicator} publish={publish} />

			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}

			<CheckSecondLang />
			<OperationsIndicatorVisualization
				secondLang={secondLang}
				attr={indicator}
				langs={langs}
				frequency={frequency}
				organisations={organisations}
			/>
		</div>
	);
};

export default IndicatorVisualizationContainer;
