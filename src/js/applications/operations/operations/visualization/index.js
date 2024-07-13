import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as select from '../../../../reducers';
import { useGoBack } from '../../../../hooks/hooks';
import { Loading } from '../../../../new-architecture/components/loading/loading';
import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';
import OperationsOperationVisualization from './home';
import D from '../../../../i18n';

import {
	Auth,
	ValidationButton,
	Stores,
	CheckSecondLang,
	PageTitleBlock,
	ErrorBloc,
} from '../../../../utils';
import api from '../../../../remote-api/operations-api';

const OperationVisualizationContainer = () => {
	const { id } = useParams();
	const [operation, setOperation] = useState({});
	const langs = useSelector((state) => select.getLangs(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const [serverSideError, setServerSideError] = useState();
	const [publishing, setPublishing] = useState(false);
	const goBack = useGoBack();

	useEffect(() => {
		if (id) {
			api.getOperation(id).then((result) => {
				setOperation(result);
			});
		}
	}, [id]);

	const publish = useCallback(() => {
		setPublishing(true);

		api
			.publishOperation(operation)
			.then(() => {
				return api.getOperation(id).then(setOperation);
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
