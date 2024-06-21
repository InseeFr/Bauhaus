import { Component } from 'react';
import ModalRmes from 'js/applications/shared/modal-rmes/modal-rmes';
import Picker from 'js/applications/shared/picker-page';
import check from 'js/utils/auth';
import D from 'js/i18n';
import { getModalMessage } from 'js/utils/concepts/build-validation-message';
import { PublishButton } from '@inseefr/wilco';

class ConceptsToValidate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalValid: false,
			idWithValid: [],
		};

		this.handleValidateConceptList = (ids) => {
			this.props.handleValidateConceptList(ids);
		};
		this.handleClickValidation = (ids) => {
			this.setState({ ids });
			const idWithValid = ids.reduce((_, id) => {
				const { label: prefLabelLg1, valid } = this.props.concepts.find(
					(c) => c.id === id
				);
				if (valid) _.push({ prefLabelLg1, valid });
				return _;
			}, []);
			idWithValid.length === 0
				? this.handleValidateConceptList(ids)
				: this.setState({ idWithValid, modalValid: true });
		};
		this.handleCancelValidation = () => this.setState({ modalValid: false });
		this.handleConfirmValidation = () => {
			this.handleCancelValidation();
			this.handleValidateConceptList(this.state.ids);
		};
	}

	render() {
		const { modalValid, idWithValid } = this.state;
		const {
			concepts,
			permission: { authType, roles, stamp },
		} = this.props;
		const authImpl = check(authType);

		const modalButtons = [
			{
				label: D.btnCancel,
				action: this.handleCancelValidation,
				style: 'primary',
			},
			{
				label: D.btnValid,
				action: this.handleConfirmValidation,
				style: 'primary',
			},
		];

		const filteredConcepts = authImpl.filterConceptsToValidate(
			concepts,
			roles,
			stamp
		);
		return (
			<div>
				<Picker
					items={filteredConcepts}
					title={D.conceptsToValidTitle}
					panelTitle={D.conceptsToValidPanelTitle}
					labelWarning={D.hasNotConceptToValid}
					ValidationButton={PublishButton}
					handleAction={this.handleClickValidation}
					context="concepts"
				/>
				<ModalRmes
					id="validation-concept-modal"
					isOpen={modalValid}
					title="Confirmation de la validation"
					body={getModalMessage(idWithValid)}
					modalButtons={modalButtons}
					closeCancel={this.handleCancelValidation}
				/>
			</div>
		);
	}
}

export default ConceptsToValidate;
