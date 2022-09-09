import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect, useSelector } from 'react-redux';
import ItemVisualization from './home';
import { Loading } from '@inseefr/wilco';
import loadItem from 'js/actions/classifications/item';
import * as select from 'js/reducers/classifications/item';
import * as mainSelect from 'js/reducers';
import { Stores } from 'bauhaus-utilities';
import { useParams } from 'react-router-dom';

const ItemVisualizationContainer = ({ loadItem }) => {

	const { classificationId, itemId } = useParams();
	const item = useSelector(state => select.getItem(state, classificationId, itemId));
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state));
	const langs = useSelector(state => mainSelect.getLangs(state));

	const currentItemId = item?.id;
	useEffect(() => {
		if(currentItemId !== itemId){
			loadItem(classificationId, itemId);
		}
	}, [currentItemId, classificationId, itemId, loadItem]);
	if (!item) return <Loading />;
	return (
		<ItemVisualization item={item} secondLang={secondLang} langs={langs} />
	);
}

ItemVisualizationContainer.propTypes = {
	loadItem: PropTypes.func
};

const mapDispatchToProps = {
	loadItem,
};

export default connect(
	undefined,
	mapDispatchToProps
)(ItemVisualizationContainer);
