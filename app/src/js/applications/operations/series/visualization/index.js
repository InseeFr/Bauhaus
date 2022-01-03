import React, { useEffect, useState, useCallback } from 'react';
import D from 'js/i18n';
import * as select from 'js/reducers';
import { useSelector } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import OperationsSerieVisualization from 'js/applications/operations/series/visualization/home';

import {
	Loading,
	ErrorBloc,
	Button,
	ActionToolbar,
	goBack,
	ReturnButton,
} from '@inseefr/wilco';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';

import {
	Auth,
	HTMLUtils,
	ValidationButton,
	Stores,
	CheckSecondLang,
	PageTitleBlock,
} from 'bauhaus-utilities';
import api from '../../../../remote-api/operations-api';

const SeriesVisualizationContainer = (props) => {
	const { id } = useParams();
	const [series, setSeries] = useState({})
	const [publishing, setPublishing] = useState(false)
	const [serverSideError, setServerSideError] = useState()

	const frequencies = useSelector(state => state.operationsCodesList.results[CL_FREQ] || {});
	const organisations = useSelector(state => state.operationsOrganisations.results || []);
	const categories = useSelector(state => state.operationsCodesList.results[CL_SOURCE_CATEGORY] || {});
	const langs = useSelector(state => select.getLangs(state))
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state));

	const frequency = frequencies.codes.find(
		(c) => c.code === series.accrualPeriodicityCode
	);
	const category = categories.codes.find((c) => c.code === series.typeCode)
	useEffect(() => {
		api.getSerie(id).then(result => setSeries(result))
	}, [id]);

	const publish = useCallback(() => {
		setPublishing(true);

		api.publishSeries(series).then(() => {
			return api.getFamily(id).then(setSeries)
		}).catch((error) => setServerSideError(error))
			.finally(() => setPublishing(false))
	}, [series, id]);

	const ableToCreateASimsForThisSeries = (series.operations || []).length === 0;
	if (!series.id) return <Loading />;
	if (publishing) return <Loading text={"publishing"} />;

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = HTMLUtils.containUnsupportedStyles(series);
	const checkStamp = stamp => series.creators.includes(stamp);
	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={series.prefLabelLg1}
				titleLg2={series.prefLabelLg2}
				secondLang={secondLang}
			/>

			<ActionToolbar>
				<ReturnButton action={goBack(props, '/operations/series')} />

				{series.idSims && (
					<Button
						action={`/operations/sims/${series.idSims}`}
						label={D.btnSimsVisu}
					/>
				)}
				{!series.idSims && (
					<Auth.AuthGuard
						roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}
						complementaryCheck={ableToCreateASimsForThisSeries}
					>
						<Button
							action={`/operations/series/${series.id}/sims/create`}
							label={D.btnSimsCreate}
						/>
					</Auth.AuthGuard>
				)}
				<Auth.AuthGuard roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}>
					<ValidationButton
						object={series}
						callback={publish}
						disabled={publicationDisabled}
					/>
				</Auth.AuthGuard>
				<Auth.AuthGuard
					roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}
				>
					<Button
						action={`/operations/series/${series.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth.AuthGuard>
			</ActionToolbar>

			<ErrorBloc error={serverSideError} />

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
}

export default withRouter(SeriesVisualizationContainer);
