import { useEffect, useState, useCallback } from 'react';
import D from '../../../deprecated-locales';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import OperationsSerieVisualization from '../../../modules-operations/series/visualization/home';
import {
	Loading,
	ErrorBloc,
	PageTitleBlock,
	CheckSecondLang,
} from '../../../components';

import { useCodesList } from '../../../utils/hooks/codeslist';
import { getLocales } from '../../../redux/selectors';
import { OperationsApi } from '../../../sdk/operations-api';
import {
	CL_FREQ,
	CL_SOURCE_CATEGORY,
} from '../../../redux/actions/constants/codeList';
import { Menu } from './menu';
import { useSecondLang } from '../../../utils/hooks/second-lang';

const SeriesVisualizationContainer = () => {
	const { id } = useParams();
	const [series, setSeries] = useState({});
	const [publishing, setPublishing] = useState(false);
	const [serverSideError, setServerSideError] = useState();

	const frequencies = useCodesList(CL_FREQ);
	const organisations = useSelector(
		(state) => state.operationsOrganisations.results || []
	);
	const categories = useCodesList(CL_SOURCE_CATEGORY);
	const langs = useSelector((state) => getLocales(state));
	const [secondLang] = useSecondLang();

	const frequency = frequencies.codes.find(
		(c) => c.code === series.accrualPeriodicityCode
	);
	const category = categories.codes.find((c) => c.code === series.typeCode);
	useEffect(() => {
		OperationsApi.getSerie(id).then((result) => setSeries(result));
	}, [id]);

	const publish = useCallback(() => {
		setPublishing(true);

		OperationsApi.publishSeries(series)
			.then(() => {
				return OperationsApi.getSerie(id).then(setSeries);
			})
			.catch((error) => setServerSideError(error))
			.finally(() => setPublishing(false));
	}, [series, id]);

	if (!series.id) return <Loading />;
	if (publishing) return <Loading text={'publishing'} />;

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={series.prefLabelLg1}
				titleLg2={series.prefLabelLg2}
				secondLang={secondLang}
			/>

			<Menu series={series} onPublish={publish} />

			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}

			<CheckSecondLang />
			<OperationsSerieVisualization
				secondLang={secondLang}
				attr={series}
				langs={langs}
				frequency={frequency}
				category={category}
				organisations={organisations}
			/>
		</div>
	);
};

export default SeriesVisualizationContainer;
