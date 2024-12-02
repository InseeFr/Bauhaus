import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CheckSecondLang } from '@components/check-second-lang';
import { ErrorBloc } from '@components/errors-bloc';
import { Loading } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';

import { OperationsApi } from '@sdk/operations-api';

import { useSecondLang } from '@utils/hooks/second-lang';

import D from '../../../deprecated-locales';
import OperationsOperationVisualization from './home';
import { Menu } from './menu';

export const Component = () => {
	const { id } = useParams();
	const [operation, setOperation] = useState({});
	const [secondLang] = useSecondLang();
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
	if (publishing) return <Loading text="publishing" />;

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
				secondLang={secondLang}
			/>
		</div>
	);
};
