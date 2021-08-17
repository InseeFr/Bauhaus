import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import CollectionsToValidate from './home';
import { Loading } from '@inseefr/wilco';
import * as select from 'js/reducers';
import validateCollectionList from 'js/actions/collections/validate';
import loadCollectionValidateList from 'js/actions/collections/validate-list';
import { VALIDATE_COLLECTION_LIST } from 'js/actions/constants';
import { OK } from 'js/constants';
import { Auth, useTitle } from 'bauhaus-utilities';
import D from 'js/i18n';

const CollectionsToValidateContainer =
	({ validateCollectionList, collections, loadCollectionValidateList, permission, validationStatus }) => {
	useTitle(D.collectionsTitle, D.btnValid);

	const [validationRequested, setValidationRequested] = useState(false);

	const handleValidateCollectionList = ids => {
		validateCollectionList(ids);
		setValidationRequested(true)
	};

	useEffect(() => {
		if (!collections) loadCollectionValidateList();
	}, [collections, loadCollectionValidateList]);

	if (validationRequested) {
		if (validationStatus === OK) {
			return <Redirect to="/collections" />;
		} else return <Loading textType="validating" />;
	}
	if (!collections) return <Loading />;
	return (
		<CollectionsToValidate
			collections={collections}
			permission={permission}
			handleValidateCollectionList={handleValidateCollectionList}
		/>
	);
}

const mapStateToProps = state => ({
	collections: select.getCollectionValidateList(state),
	permission: Auth.getPermission(state),
	validationStatus: select.getStatus(state, VALIDATE_COLLECTION_LIST),
});

const mapDispatchToProps = {
	loadCollectionValidateList,
	validateCollectionList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CollectionsToValidateContainer);
