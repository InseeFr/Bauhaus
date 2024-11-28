import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { Loading } from '@components/loading';

import { useSecondLang } from '../../utils/hooks/second-lang';
import { fetchingPreviousLevels } from './client';
import ItemVisualization from './home';
import useClassificationItem from './hook';

export const Component = () => {
	const queryClient = useQueryClient();
	const { classificationId, itemId } = useParams();
	const [secondLang] = useSecondLang();

	const { isLoading, item } = useClassificationItem(
		classificationId,
		itemId,
		true,
	);

	if (isLoading || !item.general) return <Loading />;

	queryClient.prefetchQuery(
		['classification-parent-levels', classificationId, itemId],
		() => {
			return fetchingPreviousLevels(classificationId, item.general);
		},
	);

	return <ItemVisualization item={item} secondLang={secondLang} />;
};
