import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Loading from 'js/components/shared/loading';
import Picker from 'js/components/shared/page-picker';
import { VALIDATE_COLLECTION_LIST } from 'js/actions/constants';
import D from 'js/i18n';
import check from 'js/utils/auth/utils';
import * as select from 'js/reducers';
import validateCollectionList from 'js/actions/collections/validate';
import loadCollectionValidateList from 'js/actions/collections/validate-list';
import { OK } from 'js/constants';

class CollectionsToValidate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validationRequested: false,
		};

		this.handleValidateCollectionList = ids => {
			this.props.validateCollectionList(ids);
			this.setState({
				validationRequested: true,
			});
		};
	}
	componentWillMount() {
		if (!this.props.collections) this.props.loadCollectionValidateList();
	}
	render() {
		const { validationRequested } = this.state;
		const {
			validationStatus,
			permission: { authType, role, stamp },
		} = this.props;
		const authImpl = check(authType);

		if (validationRequested) {
			if (validationStatus === OK) {
				return <Redirect to="/collections" />;
			} else return <Loading textType="validating" context="concepts" />;
		}
		const { collections } = this.props;
		if (!collections) return <Loading textType="loading" context="concepts" />;

		const filteredCollections = authImpl.filterCollectionsToValidate(
			collections,
			role,
			stamp
		);
		return (
			<Picker
				items={filteredCollections}
				title={D.collectionsToValidTitle}
				panelTitle={D.collectionsToValidPanelTitle}
				labelWarning={D.hasNotCollectionToValid}
				labelValidateButton={D.btnValid}
				handleAction={this.handleValidateCollectionList}
				context="collections"
			/>
		);
	}
}

const mapStateToProps = state => ({
	collections: select.getCollectionValidateList(state),
	permission: select.getPermission(state),
	validationStatus: select.getStatus(state, VALIDATE_COLLECTION_LIST),
});

const mapDispatchToProps = {
	loadCollectionValidateList,
	validateCollectionList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	CollectionsToValidate
);
