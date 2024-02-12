import React, { useEffect, useState, useCallback } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import D from 'js/i18n';
import { useSelector } from 'react-redux';
import * as select from 'js/reducers';
import OperationsIndicatorVisualization from 'js/applications/operations/indicators/visualization/general';
import {
	Loading,
	Button,
	ActionToolbar,
	goBack,
	ReturnButton,
} from '@inseefr/wilco';
import api from '../../../../remote-api/operations-api';

import { CL_FREQ } from 'js/actions/constants/codeList';
import {
	Auth,
	HTMLUtils,
	ValidationButton,
	Stores,
	CheckSecondLang,
	PageTitleBlock,
	ErrorBloc
} from 'bauhaus-utilities';
import { useCodesList } from 'js/hooks/hooks';

const IndicatorVisualizationContainer = (props) =>  {

	const { id } = useParams();

	const langs = useSelector(state => select.getLangs(state));
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state));
	const frequency = useCodesList(CL_FREQ)
	const organisations = useSelector(state => state.operationsOrganisations.results || []);

	const [indicator, setIndicator] = useState({});

	const [serverSideError, setServerSideError] = useState();
	const [publishing, setPublishing] = useState(false);

	const publish = useCallback(() => {
		setPublishing(true);
		api.publishIndicator(indicator).then(() => {
			return api.getIndicator(id).then(setIndicator)
		}).catch((error) => setServerSideError(error))
			.finally(() => setPublishing(false))
	}, [indicator, id]);

	useEffect(() => {
		api.getIndicator(id).then(payload => setIndicator(payload))
	}, [id])

	if (!indicator.id) return <Loading />;
	if (publishing) return <Loading text={"publishing"} />;


	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = HTMLUtils.containUnsupportedStyles(indicator);
	const checkStamp = stamp => indicator.creators.includes(stamp);

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={indicator.prefLabelLg1}
				titleLg2={indicator.prefLabelLg2}
				secondLang={secondLang}
			/>
			<ActionToolbar>
				<ReturnButton action={goBack(props, '/operations/indicators')} />
				{indicator.idSims && (
					<>
						<Button
							action={`/operations/sims/${indicator.idSims}`}
							label={D.btnSimsVisu}
						/>
					</>
				)}
				{!indicator.idSims && (
					<Auth.AuthGuard roles={[Auth.ADMIN, [Auth.INDICATOR_CONTRIBUTOR, checkStamp]]}>
						<Button
							action={`/operations/indicator/${indicator.id}/sims/create`}
							label={D.btnSimsCreate}
						/>
					</Auth.AuthGuard>
				)}
				<Auth.AuthGuard roles={[Auth.ADMIN, [Auth.INDICATOR_CONTRIBUTOR, checkStamp]]}>
					<ValidationButton
						object={indicator}
						callback={publish}
						disabled={publicationDisabled}
					/>
					<Button
						action={`/operations/indicator/${indicator.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth.AuthGuard>
			</ActionToolbar>
			{ serverSideError && <ErrorBloc error={serverSideError} D={D}/>}

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
}

export default withRouter(IndicatorVisualizationContainer);
