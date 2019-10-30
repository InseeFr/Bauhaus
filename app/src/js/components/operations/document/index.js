import React, { Component } from 'react';
import { Loading } from 'bauhaus-library';
import DocumentHome from './home';
import { connect } from 'react-redux';
import { LOADED } from 'js/constants';
import {
	getOperationsDocuments,
	getOperationsDocumentsStatus,
} from 'js/reducers/operations/selector';
import loadDocuments from 'js/actions/operations/documents/list';
import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

class OperationsDocumentsContainer extends Component {
	componentWillMount() {
		if (this.props.documentStoresStatus !== LOADED) {
			this.props.loadDocuments();
		}
	}
	render() {
		const { documentStores, documentStoresStatus } = this.props;
		if (documentStoresStatus !== LOADED) return <Loading />;
		return <DocumentHome documents={documentStores} />;
	}
}

export const mapStateToProps = state => {
	return {
		documentStoresStatus: getOperationsDocumentsStatus(state),
		documentStores: sortByLabel(
			getOperationsDocuments(state).map(document => {
				return {
					id: document.id,
					label: document.labelLg1 || document.labelLg2,
					uri: document.uri,
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
