import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Loading from 'js/components/shared/loading';
import ModalRmes from 'js/components/shared/modal-rmes';
import ConceptsPicker from './picker';
import { VALIDATE_CONCEPT_LIST } from 'js/actions/constants';
import { dictionary } from 'js/utils/dictionary';
import check from 'js/utils/auth/utils';
import * as select from 'js/reducers';
import validateConceptList from 'js/actions/concepts/validate';
import loadConceptValidateList from 'js/actions/concepts/validate-list';
import { getModalMessage } from 'js/utils/concepts/build-validation-message';
import { OK } from 'js/constants';

class ConceptsToValidate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validationRequested: false,
			modalValid: false,
			idWithValid: [],
		};

		this.handleValidateConceptList = ids => {
			this.props.validateConceptList(ids);
			this.setState({
				validationRequested: true,
			});
		};
		this.handleClickValidation = ids => {
			this.setState({ ids });
			const idWithValid = ids.reduce((_, id) => {
				const { label: prefLabelLg1, valid } = this.props.concepts.find(
					c => c.id === id
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
	componentWillMount() {
		if (!this.props.concepts) this.props.loadConceptValidateList();
	}
	render() {
		const { validationRequested, modalValid, idWithValid } = this.state;
		const {
			validationStatus,
			permission: { authType, role, stamp },
		} = this.props;
		const authImpl = check(authType);

		const modalButtons = [
			{
				label: dictionary.buttons.cancel,
				action: this.handleCancelValidation,
				style: 'primary',
			},
			{
				label: dictionary.buttons.validate,
				action: this.handleConfirmValidation,
				style: 'primary',
			},
		];

		if (validationRequested) {
			if (validationStatus === OK) {
				return <Redirect to="/concepts" />;
			} else {
				return <Loading textType="validating" context="concepts" />;
			}
		}
		const { concepts } = this.props;
		if (!concepts) return <Loading textType="loading" context="concepts" />;

		const filteredConcepts = authImpl.filterConceptsToValidate(
			concepts,
			role,
			stamp
		);
		return (
			<div>
				<ConceptsPicker
					concepts={filteredConcepts}
					title={dictionary.concepts.validation.title}
					panelTitle={dictionary.concepts.validation.panel}
					labelLoadable={dictionary.loadable.validation}
					labelWarning={dictionary.warning.validation.concepts}
					labelValidateButton={dictionary.buttons.validate}
					handleAction={this.handleClickValidation}
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

const mapStateToProps = state => ({
	concepts: select.getConceptValidateList(state),
	permission: select.getPermission(state),
	validationStatus: select.getStatus(state, VALIDATE_CONCEPT_LIST),
});

const mapDispatchToProps = {
	loadConceptValidateList,
	validateConceptList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConceptsToValidate);
