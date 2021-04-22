import loadDocument  from 'js/actions/operations/documents/item';
import {
	Loading,
	Button,
	ActionToolbar,
	buildExtract,
	goBack,
	ReturnButton,
} from '@inseefr/wilco';
import {
	Auth,
	CheckSecondLang,
	Stores,
	PageTitleBlock,
} from 'bauhaus-utilities';
import { loadCodesList } from 'js/actions/operations/utils/setup';

import D from 'js/i18n';
import * as select from 'js/reducers';
import { getCurrentDocument } from 'js/reducers/operations/selector';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OperationsDocumentVisualization from './home';
import { ADMIN } from 'bauhaus-utilities/src/auth/roles';

const extractId = buildExtract('id');

function getPath(path) {
	return path.includes('document') ? 'document' : 'link';
}
class DocumentationVisualizationContainer extends Component {
	static propTypes = {
		document: PropTypes.object.isRequired,
		id: PropTypes.string.isRequired,
		langs: PropTypes.object,
		secondLang: PropTypes.bool,
	};

	componentWillMount() {
		if (!this.props.document.id) {
			const type = getPath(this.props.match.path);
			this.props.loadDocument(this.props.id, type);
		}
		if(!this.props.langOptions.codes){
			this.props.loadLangCodesList()
		}
	}

	checkContributorRight = stamp => {
		const sims = this.props.document.sims;
		if(sims?.length === 0){
			return true;
		}
		const stamps = sims.map(({creators}) => creators);
		for(let i = 1; i < stamps.length; i++){
			// we first check if all stamps array have the same size.
			if(stamps[i - 1].length !== stamps[i].length){
				return false;
			}
			if(stamps[i - 1].length > 0 && stamps[i - 1].filter(s => stamps[i].includes(s)).length === 0){
				return false;
			}
		}
		return stamps[0].includes(stamp);
	}

	render() {
		const { id, document, langs, secondLang, langOptions } = this.props;
		const type = getPath(this.props.match.path);
		if (!document.id) return <Loading />;

		return (
			<div className="container">
				<PageTitleBlock
					titleLg1={document.labelLg1 || document.labelLg2}
					titleLg2={document.labelLg2}
					secondLang={secondLang}
				/>

				<ActionToolbar>
					<ReturnButton action={goBack(this.props, '/operations/documents')} />

					<Auth.AuthGuard
						roles={[
							ADMIN,
							[Auth.SERIES_CONTRIBUTOR, this.checkContributorRight],
							[Auth.INDICATOR_CONTRIBUTOR, this.checkContributorRight]
						]}
					>
						<Button
							action={`/operations/${type}/${document.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth.AuthGuard>
				</ActionToolbar>
				<CheckSecondLang />

				<OperationsDocumentVisualization
					id={id}
					attr={document}
					langs={langs}
					secondLang={secondLang}
					langOptions={langOptions}
				/>
			</div>
		);
	}
}

export const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const document = getCurrentDocument(state);
	const langOptions = state.operationsCodesList.results['ISO-639'] || {};
	return {
		id,
		document: id === document.id ? document : {},
		langs: select.getLangs(state),
		secondLang: Stores.SecondLang.getSecondLang(state),
		langOptions
	};
};

const mapDispatchToProps = dispatch => ({
	loadDocument: (id, type) => loadDocument(id, type)(dispatch),
	loadLangCodesList: () => loadCodesList(['ISO-639'], dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(DocumentationVisualizationContainer));
