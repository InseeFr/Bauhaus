import React, {useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as select from 'js/reducers';

import {
	Loading,
	Button,
	ActionToolbar,
	ReturnButton,
} from '@inseefr/wilco';
import OperationsOperationVisualization from './home';
import D from 'js/i18n';

import {
	Auth,
	ValidationButton,
	Stores,
	CheckSecondLang,
	PageTitleBlock,
	ErrorBloc,
	useRedirectWithDefault
} from 'bauhaus-utilities';
import api from '../../../../remote-api/operations-api';


const OperationVisualizationContainer = () => {
	const { id } = useParams();
	const goBack = useRedirectWithDefault('/operations/operations')
	const [operation, setOperation] = useState({});
	const langs = useSelector(state => select.getLangs(state));
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state))
	const [serverSideError, setServerSideError] = useState();
	const [publishing, setPublishing] = useState(false);


	useEffect(() => {
		if (id) {
			api.getOperation(id).then(result => {
				setOperation(result)
			})
		}
	}, [id]);

	const publish = useCallback(() => {
		setPublishing(true);

		api.publishOperation(operation).then(() => {
			return api.getOperation(id).then(setOperation)
		}).catch((error) => setServerSideError(error))
			.finally(() => setPublishing(false))
	}, [operation, id]);


	if (!operation.id) return <Loading />;
	if (publishing) return <Loading text={"publishing"} />;

	const checkStamp = stamp => operation.series.creators.includes(stamp);

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={operation.prefLabelLg1}
				titleLg2={operation.prefLabelLg2}
				secondLang={secondLang}
			/>
			<ActionToolbar>
				<ReturnButton action={goBack} />

				{operation.idSims && (
					<Button
						action={`/operations/sims/${operation.idSims}`}
						label={D.btnSimsVisu}
					/>
				)}
				{!operation.idSims && (
					<Auth.AuthGuard roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}>
						<Button
							action={`/operations/operation/${operation.id}/sims/create`}
							label={D.btnSimsCreate}
						/>
					</Auth.AuthGuard>
				)}
				<Auth.AuthGuard roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}>
					<ValidationButton
						object={operation}
						callback={publish}
					/>
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

			{serverSideError && <ErrorBloc error={serverSideError} D={D}/>}

			<CheckSecondLang />

			<OperationsOperationVisualization
				id={id}
				attr={operation}
				langs={langs}
				secondLang={secondLang}
			/>
		</div>
	);
}

OperationVisualizationContainer.propTypes = {
	operation: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired,
	exportVariableBook: PropTypes.func,
	exportStatus: PropTypes.string,
	langs: PropTypes.object,
	secondLang: PropTypes.bool,
};

export default OperationVisualizationContainer;
