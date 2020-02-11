import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import CollectionsToValidate from './home';
import { Loading } from '@inseefr/ui';
import * as select from 'js/reducers';
import validateCollectionList from 'js/actions/collections/validate';
import loadCollectionValidateList from 'js/actions/collections/validate-list';
import { VALIDATE_COLLECTION_LIST } from 'js/actions/constants';
import { OK } from 'js/constants';

class CollectionsToValidateContainer extends Component {
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
		const { collections, permission, validationStatus } = this.props;
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
				handleValidateCollectionList={this.handleValidateCollectionList}
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CollectionsToValidateContainer);
