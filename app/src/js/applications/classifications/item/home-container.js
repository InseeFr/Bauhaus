import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import ItemVisualization from './home';
import { Loading } from '@inseefr/wilco';
import loadItem from 'js/actions/classifications/item';
import * as select from 'js/reducers/classifications/item';
import * as mainSelect from 'js/reducers';
import { Stores } from 'bauhaus-utilities';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../remote-api/classifications-api';

const ItemVisualizationContainer = ({ loadItem }) => {
	const { classificationId, itemId } = useParams();
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state));
	const langs = useSelector(state => mainSelect.getLangs(state));

	useEffect(() => {
		if(classificationId && itemId){
			loadItem(classificationId, itemId)
		}
	},[classificationId, itemId, loadItem])

	const { isLoading: isGeneralLoading, data: general } = useQuery(['classifications-item-general', classificationId, itemId], () => {
		return api.getClassificationItemGeneral(classificationId, itemId);
	});
	const { isLoading: isNarrowersLoading, data: narrowers } = useQuery(['classifications-item-narrowers', classificationId, itemId], () => {
		return api.getClassificationItemNarrowers(classificationId, itemId);
	});
	const item = useSelector(state => select.getItem(state, classificationId, itemId));

	if (!item || isGeneralLoading || isNarrowersLoading) return <Loading />;


	// TODO to be removed when notes will be moved away from the Readux Store
	const fullItem = {
		...item,
		general,
		narrowers
	}

	return (
		<ItemVisualization item={fullItem} secondLang={secondLang} langs={langs} />
	);

}

const mapDispatchToProps = {
	loadItem,
};

export default connect(
	undefined,
	mapDispatchToProps
)(ItemVisualizationContainer);
