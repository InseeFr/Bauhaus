import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ConceptVisualizationControls from './visualization-controls';
import ConceptGeneral from './general';
import ConceptLinks from './links';
import ConceptNotes from './notes';
import ModalRmes from 'js/components/shared/modal-rmes';
import { dictionary } from 'js/utils/dictionary';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { propTypesBilingual as linksPropTypes } from 'js/utils/concepts/links';
import { isOutOfDate } from 'js/utils/moment';
import { dateTimeToDateString } from 'js/utils/utils';

//TODO introduce a container component
class ConceptVisualization extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalValid: false,
		};
		this.handleClickValidation = () => {
			const { id, general: { valid } } = this.props;
			if (valid) this.setState({ modalValid: true });
			else this.props.validateConcept(id);
		};
		this.handleCancelValidation = () => this.setState({ modalValid: false });
		this.handleConfirmValidation = () => {
			this.handleCancelValidation();
			this.props.validateConcept(this.props.id);
		};
	}

	render() {
		const { id, general, links, notes, secondLang } = this.props;
		const { modalValid } = this.state;
		const { conceptVersion, isValidated, valid } = general;

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

		let modalMessage = `<p>Ce concept ayant une date de fin de validité au <b>${dateTimeToDateString(
			valid
		)}</b>, vous ne pourrez plus le modifier`;
		modalMessage += isOutOfDate(valid) ? `.</p>` : ` après cette date.</p>`;

		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<label className="pull-right">
								<input
									type="checkbox"
									checked={secondLang}
									onChange={this.props.saveSecondLang}
								/>{' '}
								{dictionary.displayLg2}
							</label>
						</div>
					</div>
					<div className="row">
						<div className="col-md-10 centered col-md-offset-1">
							<h2 className="page-title">{general.prefLabelLg1}</h2>
						</div>
					</div>
					{secondLang &&
						general.prefLabelLg2 && (
							<div className="row">
								<div className="col-md-8 centered col-md-offset-2">
									<h3 className="page-sub-title">{general.prefLabelLg2}</h3>
								</div>
							</div>
						)}
					<ConceptVisualizationControls
						id={id}
						//TODO FIX ME
						isValidated={isValidated === 'Validé'}
						isValidOutOfDate={isOutOfDate(valid)}
						conceptVersion={conceptVersion}
						handleValidation={this.handleClickValidation}
					/>
					<ConceptGeneral secondLang={secondLang} attr={general} />
					<ConceptLinks secondLang={secondLang} links={links} />
					<ConceptNotes secondLang={secondLang} notes={notes} />
				</div>
				<ModalRmes
					id="validation-concept-modal"
					isOpen={modalValid}
					title="Confirmation de la validation"
					body={modalMessage}
					modalButtons={modalButtons}
					closeCancel={this.handleCancelValidation}
				/>
			</div>
		);
	}
}

ConceptVisualization.propTypes = {
	id: PropTypes.string, // not available for creation
	general: generalPropTypes.isRequired,
	notes: notePropTypes.isRequired,
	links: linksPropTypes.isRequired,
	stampList: PropTypes.array.isRequired,
	disseminationStatusList: PropTypes.array.isRequired,
	validateConcept: PropTypes.func.isRequired,
};

export default ConceptVisualization;
