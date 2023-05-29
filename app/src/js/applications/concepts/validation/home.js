import React, { useState } from 'react';
import ModalRmes from 'js/applications/shared/modal-rmes/modal-rmes';
import Picker from 'js/applications/shared/picker-page';
import check from 'js/utils/auth';
import D from 'js/i18n';
import { getModalMessage } from 'js/utils/concepts/build-validation-message';
import { PublishButton } from '@inseefr/wilco';

const ConceptsToValidate = ({ handleValidateConceptList, concepts, permission: { authType, roles, stamp } }) => {
	const [modalValid, setModalValid] = useState(false);
	const [idWithValid, setIdWithValid] = useState([]);
	const [ids, setIds] = useState([]);

	const handleClickValidation = ids => {
		setIds(ids);
		const idWithValid = ids.reduce((_, id) => {
			const { label: prefLabelLg1, valid } = concepts.find(
				c => c.id === id
			);
			if (valid) _.push({ prefLabelLg1, valid });
			return _;
		}, []);

		if(idWithValid.length === 0){
			handleValidateConceptList(ids)
		} else {
			setIdWithValid(idWithValid);
			setModalValid(true)
		}
	}

	const handleCancelValidation = () => setModalValid(false);
	const handleConfirmValidation = () => {
		handleCancelValidation();
		handleValidateConceptList(ids);
	};

	const authImpl = check(authType);

		const modalButtons = [
			{
				label: D.btnCancel,
				action: handleCancelValidation,
				style: 'primary',
			},
			{
				label: D.btnValid,
				action: handleConfirmValidation,
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
					handleAction={handleClickValidation}
					context="concepts"
				/>
				<ModalRmes
					id="validation-concept-modal"
					isOpen={modalValid}
					title="Confirmation de la validation"
					body={getModalMessage(idWithValid)}
					modalButtons={modalButtons}
					closeCancel={handleCancelValidation}
				/>
			</div>
		);
}


export default ConceptsToValidate;
