import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import CollectionsHome from './home';
import { dictionary } from 'js/utils/dictionary';
import { NOT_LOADED } from 'js/constants';
import loadCollectionList from 'js/actions/collections/list';

class CollectionsHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.collectionList) {
			this.props.loadCollectionList();
		}
	}

	render() {
		const { collections } = this.props;

		if (!collections) {
			return (
				<div>
					<Loadable
						active={true}
						spinner
						text={dictionary.loadable.loading}
						color="#457DBB"
						background="grey"
						spinnerSize="400px"
					/>
				</div>
			);
		}
		return <CollectionsHome collections={collections} />;
	}
}

const mapStateToProps = state => {
	if (!state.collectionList) {
		return {
			status: NOT_LOADED,
			collections: [],
		};
	}
	//TODO should be sorted in the state, shouldn't they ?
	let { results: collections, status, err } = state.collectionList;

	return {
		collections,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadCollectionList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	CollectionsHomeContainer
);
