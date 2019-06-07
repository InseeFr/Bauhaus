import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadDocument, {
	saveDocument,
} from 'js/actions/operations/documents/item';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import buildExtract from 'js/utils/build-extract';
import Loading from 'js/components/shared/loading';
import DocumentationEdition from 'js/components/operations/document/edition/edition';
import { getCurrentDocument } from 'js/reducers/operations/selector';
import { isDocument, LINK, DOCUMENT } from '../utils';

const extractId = buildExtract('id');

class OperationsDocumentationEditionContainer extends Component {
	componentDidMount() {
		if (!this.props.document.id && this.props.id) {
			this.props.loadDocument(this.props.id);
		}
	}
	render() {
		if (!this.props.document)
			return <Loading textType="loading" context="operations" />;
		if (this.props.operationsAsyncTask)
			return <Loading textType="saving" context="operations" />;
		return <DocumentationEdition {...this.props} />;
	}
}

const mapDispatchToProps = {
	loadDocument,
	saveDocument,
};

export const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);

	const pathName = ownProps.location.pathname;
	const document = id ? getCurrentDocument(state) : {};
	let type;
	if (/(link|document)\/create/.test(pathName)) {
		type = /(link|document)\/create/.exec(pathName)[1];
	} else if (document.uri) {
		type = isDocument(document) ? DOCUMENT : LINK;
	}
	const langs = select.getLangs(state);
	return {
		id,
		document,
		langs,
		operationsAsyncTask: state.operationsAsyncTask,
		type,
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(OperationsDocumentationEditionContainer)
);
