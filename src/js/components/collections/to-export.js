import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CollectionsPicker from './picker';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import { EXPORT_COLLECTION_LIST } from 'js/actions/constants';
import Loadable from 'react-loading-overlay';
import exportCollectionList from 'js/actions/collections/export-multi';
import loadCollectionList from 'js/actions/collections/list';
import { OK } from 'js/constants';

class CollectionsToExport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			exportRequested: false,
		};
		this.handleExportCollectionList = ids => {
			this.props.exportCollectionList(ids);
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
		console.log('requested ?');
		console.log(exportRequested);
		console.log('status ?');
		console.log(exportStatus);
		if (exportRequested) {
			if (exportStatus === OK) {
				return <Redirect to="/collections" />;
			}
			return (
				<Loadable
					active={true}
					spinner
					text={dictionary.loadable.exporting}
					color="#457DBB"
					background="grey"
					spinnerSize="400px"
				/>
			);
		}

		if (!collections) {
			return (
				<Loadable
					active={true}
					spinner
					text={dictionary.loadable.loading}
					color="#457DBB"
					background="grey"
					spinnerSize="400px"
				/>
			);
		}

		return (
			<CollectionsPicker
				collections={collections}
				title={dictionary.collections.export.title}
				panelTitle={dictionary.collections.export.panel}
				labelLoadable={dictionary.loadable.exporting}
				labelWarning={dictionary.warning.export.collections}
				labelValidateButton={dictionary.buttons.export}
				handleAction={this.handleExportCollectionList}
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

export default connect(mapStateToProps, mapDispatchToProps)(
	CollectionsToExport
);
