import { saveSecondLang } from 'js/actions/app';
import loadDocument from 'js/actions/operations/documents/item';
import { Button } from 'bauhaus-library';
import { Loading } from 'bauhaus-library';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import D from 'js/i18n';
import * as select from 'js/reducers';
import { getSecondLang } from 'js/reducers/app';
import { getCurrentDocument } from 'js/reducers/operations/selector';
import buildExtract from 'js/utils/build-extract';
import { goBack } from 'js/utils/redirection';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OperationsDocumentVisualization from './home';
import { compose } from 'recompose';
import PageTitleBlock from 'js/components/shared/page-title-block';
import Auth from 'js/utils/auth/components/auth';
import { INDICATOR_CREATOR, ADMIN, SERIES_CREATOR } from 'js/utils/auth/roles';

const extractId = buildExtract('id');

class DocumentationVisualizationContainer extends Component {
	static propTypes = {
		document: PropTypes.object.isRequired,
		id: PropTypes.string.isRequired,
		langs: PropTypes.object,
		secondLang: PropTypes.bool,
		saveSecondLang: PropTypes.func,
	};

	componentWillMount() {
		if (!this.props.document.id) {
			this.props.loadDocument(this.props.id);
		}
	}

	render() {
		const { id, document, langs, secondLang, saveSecondLang } = this.props;

		if (!document.id) return <Loading />;

		return (
			<div className="container">
				<PageTitleBlock
					titleLg1={document.labelLg1 || document.labelLg2}
					titleLg2={document.labelLg2}
					secondLang={secondLang}
				/>

				<div className="row btn-line">
					<Button
						action={goBack(this.props, '/operations/documents')}
						label={D.btnReturn}
					/>

					<div className="col-md-8 centered" />
					<Auth roles={[ADMIN, SERIES_CREATOR, INDICATOR_CREATOR]}>
						<Button
							action={`/operations/document/${document.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth>
				</div>
				<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />

				<OperationsDocumentVisualization
					id={id}
					attr={document}
					langs={langs}
					secondLang={secondLang}
					saveSecondLang={saveSecondLang}
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
		secondLang: getSecondLang(state),
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadDocument,
};

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
	withRouter
)(DocumentationVisualizationContainer);
