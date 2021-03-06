import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import loadDocument, {
	saveDocument,
} from 'js/actions/operations/documents/item';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import { buildExtract, Loading } from '@inseefr/wilco';
import DocumentationEdition from 'js/applications/operations/document/edition/edition';
import { getCurrentDocument } from 'js/reducers/operations/selector';
import { loadCodesList } from 'js/actions/operations/utils/setup';

const extractId = buildExtract('id');

class OperationsDocumentationEditionContainer extends Component {
	componentDidMount() {
		if (!this.props.document.id && this.props.id) {
			this.props.loadDocument(this.props.id, this.props.type);
		}
		if(!this.props.langOptions.codes){
			this.props.loadLangCodesList()
		}
	}
	render() {
		if (!this.props.document) return <Loading />;
		return <DocumentationEdition {...this.props} />;
	}
}

const mapDispatchToProps = dispatch => ({
	loadDocument:  (...args) => loadDocument(...args)(dispatch),
	saveDocument: (...args) => saveDocument(...args)(dispatch),
	loadLangCodesList: () => loadCodesList(['ISO-639'], dispatch)
});


export const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);

	const pathName = ownProps.location.pathname;
	const document = id ? getCurrentDocument(state) : {};
	const type = /(link|document)/.exec(pathName)[1];
	const langs = select.getLangs(state);
	const langOptions = state.operationsCodesList.results['ISO-639'] || {};
	return {
		id,
		document,
		langs,
		operationsAsyncTask: state.operationsAsyncTask,
		type,
		langOptions,
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(OperationsDocumentationEditionContainer)
);
