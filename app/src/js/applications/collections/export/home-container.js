import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CollectionsToExport from './home';
import * as select from 'js/reducers';
import { EXPORT_COLLECTION_LIST } from 'js/actions/constants';
import { Loading } from '@inseefr/wilco';
import exportCollectionList from 'js/actions/collections/export-multi';
import loadCollectionList from 'js/actions/collections/list';
import { OK } from 'js/constants';
import { useTitle } from 'bauhaus-utilities';
import D from '../../../i18n/build-dictionary';

const CollectionsToExportContainer = ({
	collections,
	exportStatus,
	loadCollectionList,
	exportCollectionList,
}) => {
	useTitle(D.collectionsTitle, D.exportTitle)

	const [exportRequested, setExportRequested] = useState(false);

	const handleExportCollectionList = useCallback(
		(ids, MimeType) => {
			exportCollectionList(ids, MimeType);
			setExportRequested(true);
		},
		[exportCollectionList]
	);

	useEffect(() => {
		if (!collections) loadCollectionList();
	}, [collections, loadCollectionList]);

	if (exportRequested) {
		if (exportStatus === OK) {
			return <Redirect to="/collections" />;
		}
		return <Loading textType="exporting" />;
	}

	if (!collections) return <Loading />;
	return (
		<CollectionsToExport
			collections={collections}
			handleExportCollectionList={handleExportCollectionList}
		/>
	);
};

const mapStateToProps = state => ({
	collections: select.getCollectionList(state),
	exportStatus: select.getStatus(state, EXPORT_COLLECTION_LIST),
});

const mapDispatchToProps = {
	loadCollectionList,
	exportCollectionList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CollectionsToExportContainer);
