import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Loading } from '@components/loading';

import { OperationsApi } from '@sdk/operations-api';

import { useGoBack } from '@utils/hooks/useGoBack';
import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales';
import { Operation } from '../../../model/Operation';
import { Series } from '../../../model/operations/series';
import OperationsOperationEdition from '../../../modules-operations/operations/edition/edition';
import { ReduxModel } from '../../../redux/model';

export const Component = () => {
	const { id } = useParams<{ id: string }>();
	const [series, setSeries] = useState<Series[]>([]);
	const [operation, setOperation] = useState<Operation | undefined>(undefined);
	const stamp = useSelector((state: ReduxModel) => state.app!.auth.user.stamp);
	const goBack = useGoBack();

	useEffect(() => {
		if (id) {
			OperationsApi.getOperation(id).then((result: Operation) => {
				setOperation(result);
			});
		}
	}, [id]);

	useEffect(() => {
		OperationsApi.getUserSeriesList(stamp).then((series: Series[]) =>
			setSeries(series),
		);
	}, [stamp]);

	useTitle(D.operationsTitle, operation?.prefLabelLg1);

	if (!operation?.id && id) return <Loading />;

	const editingOperation = operation ?? {};
	return (
		<OperationsOperationEdition
			series={series}
			id={id}
			operation={editingOperation}
			goBack={goBack}
		/>
	);
};
