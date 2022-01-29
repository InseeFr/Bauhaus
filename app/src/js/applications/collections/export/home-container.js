import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CollectionsToExport from './home';
import * as select from 'js/reducers';
import { EXPORT_COLLECTION_LIST } from 'js/actions/constants';
import { Loading } from '@inseefr/wilco';
import exportCollectionList from 'js/actions/collections/export-multi';
import { OK } from 'js/constants';
import { ArrayUtils, useTitle } from 'bauhaus-utilities';
import D from '../../../i18n/build-dictionary';
import api from '../../../remote-api/concepts-api';

const CollectionsToExportContainer = ({
	exportStatus,
	exportCollectionList,
}) => {
	useTitle(D.collectionsTitle, D.exportTitle)
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);

	const [exportRequested, setExportRequested] = useState(false);

	const handleExportCollectionList = useCallback(
		(ids, MimeType) => {
			exportCollectionList(ids, MimeType);
			setExportRequested(true);
		},
		[exportCollectionList]
	);


	useEffect(() => {
		api.getCollectionList()
			.then(body => setCollections(ArrayUtils.sortArrayByLabel(body)))
			.finally(() => setLoading(false))
	}, [])

	if (exportRequested) {
		if (exportStatus === OK) {
			return <Redirect to="/collections" />;
		}
		return <Loading textType="exporting" />;
	}


	if (loading) return <Loading />;
	return (
		<CollectionsToExport
			collections={collections}
			handleExportCollectionList={handleExportCollectionList}
		/>
	);
};

const mapStateToProps = state => ({
	exportStatus: select.getStatus(state, EXPORT_COLLECTION_LIST),
});

const mapDispatchToProps = {
	exportCollectionList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CollectionsToExportContainer);
