import React, { Component } from 'react';
import ModalRmes from 'js/components/shared/modal-rmes/modal-rmes';
import Picker from 'js/components/shared/picker-page';
import D from 'js/i18n';

class ConceptsToExport extends Component {
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
			this.handleExportConceptList('application/octet-stream');
			this.closeModal();
		};
		this.closeOdt = () => {
			this.handleExportConceptList('application/vnd.oasis.opendocument.text');
			this.closeModal();
		};
		this.handleExportConceptList = MimeType => {
			this.props.handleExportConceptList(this.state.ids, MimeType);
		};
	}

	render() {
		const { concepts } = this.props;
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
					items={concepts}
					title={D.exportTitle}
					panelTitle={D.conceptsExportPanelTitle}
					labelWarning={D.hasNotConceptToExport}
					labelValidateButton={D.btnExport}
					handleAction={this.openModal}
					context="concepts"
				/>
			</div>
		);
	}
}

export default ConceptsToExport;
