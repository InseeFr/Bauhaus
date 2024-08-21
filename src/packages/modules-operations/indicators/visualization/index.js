import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import D from '../../../deprecated-locales';
import { useSelector } from 'react-redux';
import OperationsIndicatorVisualization from '../../../modules-operations/indicators/visualization/general';
import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';
import {
	Loading,
	ErrorBloc,
	ValidationButton,
	PageTitleBlock,
	CheckSecondLang,
} from '../../../components';
import { useGoBack } from '../../../utils/hooks/useGoBack';

import { CL_FREQ } from '../../../redux/actions/constants/codeList';
import { useCodesList } from '../../../utils/hooks/codeslist';
import { containUnsupportedStyles } from '../../../utils/html-utils';
import { getLocales } from '../../../redux/selectors';
import { getSecondLang } from '../../../redux/second-lang';
import { OperationsApi } from '../../../sdk/operations-api';
import Auth from '../../../auth/components/auth';
import { ADMIN, INDICATOR_CONTRIBUTOR } from '../../../auth/roles';
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
					<Button
						action={`/operations/sims/${indicator.idSims}`}
						label={D.btnSimsVisu}
					/>
				)}
				{!indicator.idSims && (
					<Auth roles={[ADMIN, [INDICATOR_CONTRIBUTOR, checkStamp]]}>
						<Button
							action={`/operations/indicator/${indicator.id}/sims/create`}
							label={D.btnSimsCreate}
						/>
					</Auth>
				)}
				<Auth roles={[ADMIN, [INDICATOR_CONTRIBUTOR, checkStamp]]}>
					<ValidationButton
						object={indicator}
						callback={publish}
						disabled={publicationDisabled}
					/>
					<Button
						action={`/operations/indicator/${indicator.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth>
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
