import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { CheckSecondLang } from '@components/check-second-lang';
import { Loading } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';

import { DistributionApi } from '@sdk/index';

import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales/build-dictionary';
import { useDataset, useDistribution } from '../../datasets';
import { ViewMenu } from './menu';
import { ViewMainBlock } from './view-main-block';

export const Component = (props) => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { data: distribution, isLoading } = useDistribution(id);

	const { data: dataset, isLoading: isLoadingDataSet } = useDataset(
		distribution?.idDataset,
	);

	const queryClient = useQueryClient();

	const { isPending: isPublishing, mutate: publish } = useMutation({
		mutationFn: () => {
			return DistributionApi.publish(id);
		},

		onSuccess: (id) => {
			queryClient.invalidateQueries(['distributions', id]);
		},
	});

	const { isPending: isDeleting, mutate: remove } = useMutation({
		mutationFn: () => {
			return DistributionApi.deleteDistribution(id);
		},

		onSuccess: (id) => {
			return Promise.all([
				queryClient.removeQueries(['distributions', id]),
				queryClient.invalidateQueries(['distributions']),
			]).then(() => navigate('/datasets/distributions'));
		},
	});

	useTitle(D.distributionsTitle, distribution?.labelLg1);

	if (isLoading || isLoadingDataSet || isDeleting) return <Loading />;
	if (isPublishing) return <Loading text="publishing" />;

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={distribution.labelLg1}
				titleLg2={distribution.labelLg1}
			/>

			<ViewMenu
				distribution={distribution}
				dataset={dataset}
				onPublish={publish}
				onDelete={remove}
				{...props}
			/>

			<CheckSecondLang />

			<ViewMainBlock distribution={distribution} />
		</div>
	);
};
