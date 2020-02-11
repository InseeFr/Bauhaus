import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CollectionsToExport from './home';
import * as select from 'js/reducers';
import { EXPORT_COLLECTION_LIST } from 'js/actions/constants';
import { Loading } from '@inseefr/ui';
import exportCollectionList from 'js/actions/collections/export-multi';
import loadCollectionList from 'js/actions/collections/list';
import { OK } from 'js/constants';

class CollectionsToExportContainer extends Component {
	constructor() {
		super();
		this.state = {
			exportRequested: false,
		};
		this.handleExportCollectionList = (ids, MimeType) => {
			this.props.exportCollectionList(ids, MimeType);
			this.setState({
				exportRequested: true,
			});
		};
	}

	componentWillMount() {
		if (!this.props.collections) this.props.loadCollectionList();
	}

	render() {
		const { collections, exportStatus } = this.props;
		const { exportRequested } = this.state;
		if (exportRequested) {
			if (exportStatus === OK) {
				return <Redirect to="/collections" />;
			}
			return <Loading textType="exporting" />;
		}

		if (!collections) return <Loading />;
		return (
			<CollectionsToExport
				collections={collections}
				handleExportCollectionList={this.handleExportCollectionList}
			/>
		);
	}
}

const mapStateToProps = state => ({
	collections: select.getCollectionList(state),
	exportStatus: select.getStatus(state, EXPORT_COLLECTION_LIST),
});

const mapDispatchToProps = {
	loadCollectionList,
	exportCollectionList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CollectionsToExportContainer);
