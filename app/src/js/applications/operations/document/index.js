import React, { useEffect } from 'react';
import { Loading } from '@inseefr/wilco';
import DocumentHome from './home';
import { connect } from 'react-redux';
import { LOADED } from 'js/constants';
import {
	getOperationsDocuments,
	getOperationsDocumentsStatus,
} from 'js/reducers/operations/selector';
import loadDocuments from 'js/actions/operations/documents/list';
import { ArrayUtils } from 'bauhaus-utilities';

const OperationsDocumentsContainer = ({
	documentStores,
	documentStoresStatus,
	loadDocuments,
}) => {
	useEffect(() => {
		if (documentStoresStatus !== LOADED) {
			loadDocuments();
		}
	}, [documentStoresStatus, loadDocuments]);
	if (documentStoresStatus !== LOADED) return <Loading />;
	return <DocumentHome documents={documentStores} />;
};

export const mapStateToProps = state => {
	return {
		documentStoresStatus: getOperationsDocumentsStatus(state),
		documentStores: ArrayUtils.sortArrayByLabel(
			getOperationsDocuments(state).map(document => {
				return {
					id: document.id,
					label: document.labelLg1 || document.labelLg2,
					uri: document.uri,
					lang: document.lang,
					updatedDate: document.updatedDate
				};
			})
		),
	};
};

const mapDispatchToProps = {
	loadDocuments,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(OperationsDocumentsContainer);
