import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';
import {
	Loading,
	ErrorBloc,
	ValidationButton,
	PageTitleBlock,
} from '../../../../new-architecture/components';
import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';
import OperationsOperationVisualization from './home';
import D from '../../../../i18n';

import { Auth, CheckSecondLang } from '../../../../utils';
import { getLocales } from '../../../../new-architecture/redux/selectors';
import { getSecondLang } from '../../../../new-architecture/redux/second-lang';
import { OperationsApi } from '../../../../new-architecture/sdk/operations-api';

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
					<Auth.AuthGuard
						roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}
					>
						<Button
							action={`/operations/operation/${operation.id}/sims/create`}
							label={D.btnSimsCreate}
						/>
					</Auth.AuthGuard>
				)}
				<Auth.AuthGuard
					roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}
				>
					<ValidationButton object={operation} callback={publish} />
				</Auth.AuthGuard>
				<Auth.AuthGuard
					roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}
				>
					<Button
						action={`/operations/operation/${operation.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth.AuthGuard>
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
