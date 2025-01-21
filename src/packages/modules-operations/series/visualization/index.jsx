import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CheckSecondLang } from '@components/check-second-lang';
import { ErrorBloc } from '@components/errors-bloc';
import { Loading, Publishing } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';

import { OperationsApi } from '@sdk/operations-api';

import { useCodesList } from '@utils/hooks/codeslist';
import { useOrganizations } from '@utils/hooks/organizations';
import { useSecondLang } from '@utils/hooks/second-lang';
import { useLocales } from '@utils/hooks/useLocales';

import D from '../../../deprecated-locales';
import {
	CL_FREQ,
	CL_SOURCE_CATEGORY,
} from '../../../redux/actions/constants/codeList';
import OperationsSerieVisualization from './home';
import { Menu } from './menu';

export const Component = () => {
	const { id } = useParams();
	const [series, setSeries] = useState({});
	const [publishing, setPublishing] = useState(false);
	const [serverSideError, setServerSideError] = useState();
	const langs = useLocales();
	const frequencies = useCodesList(CL_FREQ);
	const { data: organisations } = useOrganizations();
	const categories = useCodesList(CL_SOURCE_CATEGORY);
	const [secondLang] = useSecondLang();

	const frequency = frequencies.codes.find(
		(c) => c.code === series.accrualPeriodicityCode,
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
	if (publishing) return <Publishing />;

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={series.prefLabelLg1}
				titleLg2={series.prefLabelLg2}
			/>

			<Menu series={series} onPublish={publish} />

			<ErrorBloc error={serverSideError} D={D} />

			<CheckSecondLang />
			<OperationsSerieVisualization
				secondLang={secondLang}
				attr={series}
				frequency={frequency}
				category={category}
				organisations={organisations}
				langs={langs}
			/>
		</div>
	);
};
