import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ModalRmes from 'js/components/shared/modal-rmes';
import ConceptsPicker from './picker';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import { EXPORT_CONCEPT_LIST } from 'js/actions/constants';
import Loadable from 'react-loading-overlay';
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
				label: dictionary.buttons.cancel,
				action: this.closeModal,
				style: 'default',
			},
			{
				label: dictionary.buttons.pdfButton,
				action: this.closePdf,
				style: 'primary',
			},
			{
				label: dictionary.buttons.odtButton,
				action: this.closeOdt,
				style: 'primary',
			},
		];

		if (exportRequested) {
			if (exportStatus === OK) {
				return <Redirect to="/concepts" />;
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

		if (!concepts) {
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
				<ModalRmes
					id="export-concept-modal"
					isOpen={displayModal}
					title={dictionary.concept.exporting.title}
					body={dictionary.concept.exporting.body}
					modalButtons={modalButtons}
					closeCancel={this.closeModal}
				/>
				<ConceptsPicker
					concepts={concepts}
					title={dictionary.concepts.export.title}
					panelTitle={dictionary.concepts.export.panel}
					labelLoadable={dictionary.loadable.exporting}
					labelWarning={dictionary.warning.export.concepts}
					labelValidateButton={dictionary.buttons.export}
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
