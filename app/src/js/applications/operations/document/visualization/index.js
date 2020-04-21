import loadDocument from 'js/actions/operations/documents/item';
import {
	Loading,
	Button,
	ActionToolbar,
	buildExtract,
	goBack,
} from '@inseefr/wilco';
import { CheckSecondLang, Stores } from 'bauhaus-utilities';

import D from 'js/i18n';
import * as select from 'js/reducers';
import { getCurrentDocument } from 'js/reducers/operations/selector';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OperationsDocumentVisualization from './home';
import PageTitleBlock from 'js/applications/shared/page-title-block';
import Auth from 'js/utils/auth/components/auth';
import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from 'js/utils/auth/roles';

const extractId = buildExtract('id');

class DocumentationVisualizationContainer extends Component {
	static propTypes = {
		document: PropTypes.object.isRequired,
		id: PropTypes.string.isRequired,
		langs: PropTypes.object,
		secondLang: PropTypes.bool,
	};

	componentWillMount() {
		if (!this.props.document.id) {
			this.props.loadDocument(this.props.id);
		}
	}

	render() {
		const { id, document, langs, secondLang } = this.props;

		if (!document.id) return <Loading />;

		return (
			<div className="container">
				<PageTitleBlock
					titleLg1={document.labelLg1 || document.labelLg2}
					titleLg2={document.labelLg2}
					secondLang={secondLang}
				/>

				<ActionToolbar>
					<Button
						action={goBack(this.props, '/operations/documents')}
						label={D.btnReturn}
					/>

					<Auth roles={[ADMIN, INDICATOR_CONTRIBUTOR, SERIES_CONTRIBUTOR]}>
						<Button
							action={`/operations/document/${document.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth>
				</ActionToolbar>
				<CheckSecondLang />

				<OperationsDocumentVisualization
					id={id}
					attr={document}
					langs={langs}
					secondLang={secondLang}
				/>
			</div>
		);
	}
}

export const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const document = getCurrentDocument(state);
	return {
		id,
		document: id === document.id ? document : {},
		langs: select.getLangs(state),
		secondLang: Stores.SecondLang.getSecondLang(state),
	};
};

const mapDispatchToProps = {
	loadDocument,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(DocumentationVisualizationContainer));
