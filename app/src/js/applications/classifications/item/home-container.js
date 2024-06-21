import { useSelector } from 'react-redux';
import ItemVisualization from './home';
import { Loading } from '@inseefr/wilco';
import * as mainSelect from 'js/reducers';
import { Stores } from 'js/utils';
import { useParams } from 'react-router-dom';
import useClassificationItem from './hook';
import { useQueryClient } from '@tanstack/react-query';
import { fetchingPreviousLevels } from './client';

const ItemVisualizationContainer = () => {
	const queryClient = useQueryClient();
	const { classificationId, itemId } = useParams();
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const langs = useSelector((state) => mainSelect.getLangs(state));

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
