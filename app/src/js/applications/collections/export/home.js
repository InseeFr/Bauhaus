import React, { Component } from 'react';
import Picker from 'js/applications/shared/picker-page';
import D from 'js/i18n';
import ModalRmes from 'js/applications/shared/modal-rmes/modal-rmes';

class CollectionsToExport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayModal: false,
			ids: [],
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
			this.props.handleExportCollectionList(this.state.ids, MimeType);
		};
	}

	render() {
		const { collections } = this.props;
		const { displayModal } = this.state;

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
				<Picker
					items={collections}
					title={D.exportTitle}
					panelTitle={D.collectionsExportPanelTitle}
					labelWarning={D.hasNotCollectionToExport}
					labelValidateButton={D.btnExport}
					handleAction={this.openModal}
					context="collections"
				/>
			</div>
		);
	}
}

export default CollectionsToExport;
