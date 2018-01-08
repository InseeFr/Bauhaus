import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CollectionsPicker from './picker';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import { EXPORT_COLLECTION_LIST } from 'js/actions/constants';
import Loadable from 'react-loading-overlay';
import ExportModal from 'js/components/shared/export-modal';
import exportCollectionList from 'js/actions/collections/export-multi';
import loadCollectionList from 'js/actions/collections/list';
import { OK } from 'js/constants';

class CollectionsToExport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayModal: false,
			ids: [],
			exportRequested: false,
		};
		this.openModal = ids =>
			this.setState({
				displayModal: true,
				ids,
			});
		this.closeModal = () =>
			this.setState({
				displayModal: false,
				ids: [],
			});
		this.closePdf = () => {
			this.handleExportCollectionList('application/octet-stream');
			this.closeModal();
		};
		this.closeOdt = () => {
			this.handleExportCollectionList(
				'application/vnd.oasis.opendocument.text'
			);
			this.closeModal();
		};
		this.handleExportCollectionList = MimeType => {
			this.props.exportCollectionList(this.state.ids, MimeType);
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
		const { displayModal, exportRequested } = this.state;
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
			<div>
				{displayModal && (
					<ExportModal
						label={dictionary.concept.exporting.title}
						isOpen={displayModal}
						closeCancel={this.closeModal}
						closePdf={this.closePdf}
						closeOdt={this.closeOdt}
					/>
				)}
				<CollectionsPicker
					collections={collections}
					title={dictionary.collections.export.title}
					panelTitle={dictionary.collections.export.panel}
					labelLoadable={dictionary.loadable.exporting}
					labelWarning={dictionary.warning.export.collections}
					labelValidateButton={dictionary.buttons.export}
					handleAction={this.openModal}
				/>
			</div>
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
