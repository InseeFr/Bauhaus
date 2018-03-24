import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ModalRmes from 'js/components/shared/modal-rmes';
import ConceptsPicker from './picker';
import D from 'js/i18n';
import * as select from 'js/reducers';
import { EXPORT_CONCEPT_LIST } from 'js/actions/constants';
import Loading from 'js/components/shared/loading';
import exportConceptList from 'js/actions/concepts/export-multi';
import loadConceptList from 'js/actions/concepts/list';
import { OK } from 'js/constants';

class ConceptsToExport extends Component {
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
			this.handleExportConceptList('application/octet-stream');
			this.closeModal();
		};
		this.closeOdt = () => {
			this.handleExportConceptList('application/vnd.oasis.opendocument.text');
			this.closeModal();
		};
		this.handleExportConceptList = MimeType => {
			this.props.exportConceptList(this.state.ids, MimeType);
			this.setState({
				exportRequested: true,
			});
		};
	}

	componentWillMount() {
		if (!this.props.concepts) this.props.loadConceptList();
	}

	render() {
		const { concepts, exportStatus } = this.props;
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
				return <Redirect to="/concepts" />;
			}
			return <Loading textType="exporting" context="concepts" />;
		}

		if (!concepts) {
			return <Loading textType="loading" context="concepts" />;
		}

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
				<ConceptsPicker
					concepts={concepts}
					title={D.exportTitle}
					panelTitle={D.conceptsExportPanelTitle}
					labelWarning={D.hasNotConceptToExport}
					labelValidateButton={D.btnExport}
					handleAction={this.openModal}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	concepts: select.getConceptList(state),
	exportStatus: select.getStatus(state, EXPORT_CONCEPT_LIST),
});

const mapDispatchToProps = {
	loadConceptList,
	exportConceptList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConceptsToExport);
