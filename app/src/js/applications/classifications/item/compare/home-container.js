import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loading, buildExtract } from '@inseefr/wilco';
import Compare from './home';
import loadItem from 'js/actions/classifications/item';
import * as select from 'js/reducers/classifications/item';
import * as mainSelect from 'js/reducers';
import { Stores } from 'bauhaus-utilities';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../remote-api/classifications-api';

const extractClassificationId = buildExtract('classificationId');
const extractItemId = buildExtract('itemId');

const CompareContainer = ({ classificationId, itemId, item, loadItem, secondLang, langs }) => {

	const { isLoading: isGeneralLoading, data: general } = useQuery(['classifications-item-general', classificationId, itemId], () => {
		return api.getClassificationItemGeneral(classificationId, itemId);
	});


	useEffect(() => {
		loadItem(classificationId, itemId);
	}, [classificationId, itemId, loadItem])

	if (isGeneralLoading || !item) return <Loading />;
	const { notes } = item;

	return (
		<Compare
			classificationId={classificationId}
			itemId={itemId}
			general={general}
			notes={notes}
			secondLang={secondLang}
			langs={langs}
		/>
	);
}

const mapStateToProps = (state, ownProps) => {
	const classificationId = extractClassificationId(ownProps);
	const itemId = extractItemId(ownProps);
	const item = select.getFullItem(state, classificationId, itemId);
	const secondLang = Stores.SecondLang.getSecondLang(state);
	const langs = mainSelect.getLangs(state);
	return {
		classificationId,
		itemId,
		item,
		secondLang,
		langs,
	};
};

const mapDispatchToProps = {
	loadItem,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(CompareContainer));
