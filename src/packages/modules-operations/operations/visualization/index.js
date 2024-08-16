import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import {
	Loading,
	ErrorBloc,
	ValidationButton,
	PageTitleBlock,
	CheckSecondLang,
} from '../../../components';
import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';
import OperationsOperationVisualization from './home';
import D from '../../../deprecated-locales';

import { getLocales } from '../../../redux/selectors';
import { getSecondLang } from '../../../redux/second-lang';
import { OperationsApi } from '../../../sdk/operations-api';
import Auth from '../../../auth/components/auth';
import { ADMIN, SERIES_CONTRIBUTOR } from '../../../auth/roles';

const OperationVisualizationContainer = () => {
	const { id } = useParams();
	const [operation, setOperation] = useState({});
	const langs = useSelector((state) => getLocales(state));
	const secondLang = useSelector((state) => getSecondLang(state));
	const [serverSideError, setServerSideError] = useState();
	const [publishing, setPublishing] = useState(false);
	const goBack = useGoBack();

	useEffect(() => {
		if (id) {
			OperationsApi.getOperation(id).then((result) => {
				setOperation(result);
			});
		}
	}, [id]);

	const publish = useCallback(() => {
		setPublishing(true);

		OperationsApi.publishOperation(operation)
			.then(() => {
				return OperationsApi.getOperation(id).then(setOperation);
			})
			.catch((error) => setServerSideError(error))
			.finally(() => setPublishing(false));
	}, [operation, id]);

	if (!operation.id) return <Loading />;
	if (publishing) return <Loading text={'publishing'} />;

	const checkStamp = (stamp) => operation.series.creators.includes(stamp);

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={operation.prefLabelLg1}
				titleLg2={operation.prefLabelLg2}
				secondLang={secondLang}
			/>
			<ActionToolbar>
				<ReturnButton action={() => goBack('/operations/operations')} />

				{operation.idSims && (
					<Button
						action={`/operations/sims/${operation.idSims}`}
						label={D.btnSimsVisu}
					/>
				)}
				{!operation.idSims && (
					<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
						<Button
							action={`/operations/operation/${operation.id}/sims/create`}
							label={D.btnSimsCreate}
						/>
					</Auth>
				)}
				<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
					<ValidationButton object={operation} callback={publish} />
				</Auth>
				<Auth roles={[ADMIN, [SERIES_CONTRIBUTOR, checkStamp]]}>
					<Button
						action={`/operations/operation/${operation.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth>
			</ActionToolbar>

			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}

			<CheckSecondLang />

			<OperationsOperationVisualization
				id={id}
				attr={operation}
				langs={langs}
				secondLang={secondLang}
			/>
		</div>
	);
};

export default OperationVisualizationContainer;
