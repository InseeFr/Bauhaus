import ItemVisualization from './home';
import { Loading } from '@components/loading';
import { useParams } from 'react-router-dom';
import useClassificationItem from './hook';
import { useQueryClient } from '@tanstack/react-query';
import { fetchingPreviousLevels } from './client';
import { useSecondLang } from '../../utils/hooks/second-lang';

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
