import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import D from '../../../../i18n';
import { useSelector } from 'react-redux';
import OperationsIndicatorVisualization from '../../../../applications/operations/indicators/visualization/general';
import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';
import {
	Loading,
	ErrorBloc,
	ValidationButton,
	PageTitleBlock,
} from '../../../../new-architecture/components';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';

import { CL_FREQ } from '../../../../new-architecture/redux/actions/constants/codeList';
import { Auth, CheckSecondLang } from '../../../../utils';
import { useCodesList } from '../../../../new-architecture/utils/hooks/codeslist';
import { containUnsupportedStyles } from '../../../../new-architecture/utils/html-utils';
import { getLocales } from '../../../../new-architecture/redux/selectors';
import { getSecondLang } from '../../../../new-architecture/redux/second-lang';
import { OperationsApi } from '../../../../new-architecture/sdk/operations-api';
const IndicatorVisualizationContainer = () => {
	const { id } = useParams();

	const langs = useSelector((state) => getLocales(state));
	const secondLang = useSelector((state) => getSecondLang(state));
	const frequency = useCodesList(CL_FREQ);
	const organisations = useSelector(
		(state) => state.operationsOrganisations.results || []
	);

	const goBack = useGoBack();

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

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = containUnsupportedStyles(indicator);
	const checkStamp = (stamp) => indicator.creators.includes(stamp);

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={indicator.prefLabelLg1}
				titleLg2={indicator.prefLabelLg2}
				secondLang={secondLang}
			/>
			<ActionToolbar>
				<ReturnButton action={() => goBack('/operations/indicators')} />
				{indicator.idSims && (
					<>
						<Button
							action={`/operations/sims/${indicator.idSims}`}
							label={D.btnSimsVisu}
						/>
					</>
				)}
				{!indicator.idSims && (
					<Auth.AuthGuard
						roles={[Auth.ADMIN, [Auth.INDICATOR_CONTRIBUTOR, checkStamp]]}
					>
						<Button
							action={`/operations/indicator/${indicator.id}/sims/create`}
							label={D.btnSimsCreate}
						/>
					</Auth.AuthGuard>
				)}
				<Auth.AuthGuard
					roles={[Auth.ADMIN, [Auth.INDICATOR_CONTRIBUTOR, checkStamp]]}
				>
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
