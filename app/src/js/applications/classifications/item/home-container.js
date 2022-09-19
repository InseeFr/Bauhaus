import React  from 'react';
import { useSelector } from 'react-redux';
import ItemVisualization from './home';
import { Loading } from '@inseefr/wilco';
import * as mainSelect from 'js/reducers';
import { Stores } from 'bauhaus-utilities';
import { useParams } from 'react-router-dom';
import useClassificationItem from './hook';

const ItemVisualizationContainer = () => {
	const { classificationId, itemId } = useParams();
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state));
	const langs = useSelector(state => mainSelect.getLangs(state));

	const { isLoading, item } = useClassificationItem(classificationId, itemId, true);

	if (isLoading || !item.general) return <Loading />;

	return (
		<ItemVisualization item={item} secondLang={secondLang} langs={langs} />
	);
}

export default ItemVisualizationContainer;
