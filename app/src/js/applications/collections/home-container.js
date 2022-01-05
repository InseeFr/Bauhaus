import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import CollectionsHome from './home';
import loadCollectionList from 'js/actions/collections/list';
import { Auth } from 'bauhaus-utilities';

const CollectionsHomeContainer = ( { collections, loadCollectionList }) =>  {
	const permission = useSelector(state => Auth.getPermission(state));

	useEffect(() => {
		if (!collections) {
			loadCollectionList();
		}
	}, [collections, loadCollectionList]);

	if (!collections) {
		return <Loading />;
	}
	return (
		<CollectionsHome collections={collections} permission={permission} />
	);
}

const mapStateToProps = state => {
	if (!state.collectionList) {
		return {
			collections: [],
		};
	}
	let { results: collections } = state.collectionList;
	return {
		collections,
	};
};

const mapDispatchToProps = {
	loadCollectionList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CollectionsHomeContainer);
