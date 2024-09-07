import ItemVisualization from './home';
import { Loading } from '../../components';
import { useParams } from 'react-router-dom';
import useClassificationItem from './hook';
import { useQueryClient } from '@tanstack/react-query';
import { fetchingPreviousLevels } from './client';
import { useSecondLang } from '../../utils/hooks/second-lang';
import { useLocales } from '../../utils/hooks/useLocales';

const ItemVisualizationContainer = () => {
	const queryClient = useQueryClient();
	const { classificationId, itemId } = useParams();
	const [secondLang] = useSecondLang();
	const langs = useLocales();

	const { isLoading, item } = useClassificationItem(
		classificationId,
		itemId,
		true
	);

	if (isLoading || !item.general) return <Loading />;

	queryClient.prefetchQuery(
		['classification-parent-levels', classificationId, itemId],
		() => {
			return fetchingPreviousLevels(classificationId, item.general);
		}
	);

	return (
		<ItemVisualization item={item} secondLang={secondLang} langs={langs} />
	);
};

export default ItemVisualizationContainer;
