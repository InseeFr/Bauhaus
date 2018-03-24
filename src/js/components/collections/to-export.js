import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CollectionsPicker from './picker';
import D from 'js/i18n';
import * as select from 'js/reducers';
import { EXPORT_COLLECTION_LIST } from 'js/actions/constants';
import Loading from 'js/components/shared/loading';
import ModalRmes from 'js/components/shared/modal-rmes';
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

		const modalButtons = [
			{
				label: D.btnCancel,
				action: this.closeModal,
				style: 'default',
			},
			{
				label: D.btnPdf,
				action: this.closePdf,
				style: 'primary',
			},
			{
				label: D.btnOdt,
				action: this.closeOdt,
				style: 'primary',
			},
		];

		if (exportRequested) {
			if (exportStatus === OK) {
				return <Redirect to="/collections" />;
			}
			return <Loading textType="exporting" context="concepts" />;
		}

		if (!collections) return <Loading textType="loading" context="concepts" />;

		return (
			<div>
				<ModalRmes
					id="export-concept-modal"
					isOpen={displayModal}
					title={D.exportModalTitle}
					body={D.exportModalBody}
					modalButtons={modalButtons}
					closeCancel={this.closeModal}
				/>
				<CollectionsPicker
					collections={collections}
					title={D.exportTitle}
					panelTitle={D.collectionsExportPanelTitle}
					labelWarning={D.hasNotCollectionToExport}
					labelValidateButton={D.btnExport}
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
