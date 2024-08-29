import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	Loading,
	ErrorBloc,
	PageTitleBlock,
	CheckSecondLang,
} from '../../../components';
import OperationsOperationVisualization from './home';
import D from '../../../deprecated-locales';

import { getLocales } from '../../../redux/selectors';
import { getSecondLang } from '../../../redux/second-lang';
import { OperationsApi } from '../../../sdk/operations-api';
import { Menu } from './menu';

const OperationVisualizationContainer = () => {
	const { id } = useParams();
	const [operation, setOperation] = useState({});
	const langs = useSelector((state) => getLocales(state));
	const secondLang = useSelector((state) => getSecondLang(state));
	const [serverSideError, setServerSideError] = useState();
	const [publishing, setPublishing] = useState(false);

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

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={operation.prefLabelLg1}
				titleLg2={operation.prefLabelLg2}
				secondLang={secondLang}
			/>
			<Menu operation={operation} onPublish={publish} />

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
