import { useEffect, useState, useCallback } from 'react';
import D from '../../../deprecated-locales';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import OperationsSerieVisualization from '../../../modules-operations/series/visualization/home';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import {
	Loading,
	ErrorBloc,
	ValidationButton,
	PageTitleBlock,
	CheckSecondLang,
} from '../../../components';

import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';

import { containUnsupportedStyles } from '../../../utils/html-utils';
import { useCodesList } from '../../../utils/hooks/codeslist';
import { getLocales } from '../../../redux/selectors';
import { getSecondLang } from '../../../redux/second-lang';
import { OperationsApi } from '../../../sdk/operations-api';
import {
	CL_FREQ,
	CL_SOURCE_CATEGORY,
} from '../../../redux/actions/constants/codeList';
import { ADMIN, SERIES_CONTRIBUTOR } from '../../../auth/roles';
import Auth from '../../../auth/components/auth';

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
	const secondLang = useSelector((state) => getSecondLang(state));

	const goBack = useGoBack();

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

	const ableToCreateASimsForThisSeries = (series.operations || []).length === 0;
	if (!series.id) return <Loading />;
	if (publishing) return <Loading text={'publishing'} />;

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = containUnsupportedStyles(series);
	const checkStamp = (stamp) => series.creators.includes(stamp);
	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={series.prefLabelLg1}
				titleLg2={series.prefLabelLg2}
				secondLang={secondLang}
			/>

			<ActionToolbar>
				<ReturnButton action={() => goBack('/operations/series')} />

				{series.idSims && (
					<Button
						action={`/operations/sims/${series.idSims}`}
						label={D.btnSimsVisu}
					/>
				)}
				{!series.idSims && (
					<Auth
						roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}
						complementaryCheck={ableToCreateASimsForThisSeries}
					>
						<Button
							action={`/operations/series/${series.id}/sims/create`}
							label={D.btnSimsCreate}
						/>
					</Auth>
				)}
				<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
					<ValidationButton
						object={series}
						callback={publish}
						disabled={publicationDisabled}
					/>
				</Auth>
				<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
					<Button
						action={`/operations/series/${series.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth>
			</ActionToolbar>

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
