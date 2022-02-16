import React, { useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import { ErrorBloc } from '@inseefr/wilco';
import ConceptVisualizationControls from './controls';
import ConceptGeneral from './general';
import ConceptLinks from './links';
import ConceptNotes from './notes';
import ModalRmes from 'js/applications/shared/modal-rmes/modal-rmes';
import D from 'js/i18n';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { propTypesBilingual as linksPropTypes } from 'js/utils/concepts/links';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import { getModalMessage } from 'js/utils/concepts/build-validation-message';
import { CheckSecondLang, DateUtils, PageTitleBlock, useTitle } from 'bauhaus-utilities';

const ConceptVisualization = ({
	id,
	permission,
	links,
	notes,
	secondLang,
	langs,
	serverSideError,
	general,
	validateConcept,
	deleteConcept,
}) => {
	useTitle( D.conceptsTitle, general?.prefLabelLg1);
	const [modalValid, setModalValid] = useState(false);

	const handleClickValidation = useCallback(() => {
		if (general.valid) setModalValid(true);
		else validateConcept(id);
	}, [id, general, validateConcept]);

	const handleCancelValidation = useCallback(() => {
		setModalValid(false);
	}, []);
	const handleConfirmValidation = useCallback(() => {
		handleCancelValidation();
		validateConcept(id);
	}, [id, validateConcept, handleCancelValidation]);
	const handleClickDeletion = useCallback(() => {
		deleteConcept(id);
	}, [id, deleteConcept]);

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

	return (
		<>
			<div className="container">
				<PageTitleBlock
					titleLg1={general.prefLabelLg1}
					titleLg2={general.prefLabelLg2}
					secondLang={secondLang}
				/>

				<ConceptVisualizationControls
					id={id}
					permission={permission}
					creator={general.creator}
					isValidated={general.isValidated === 'true'}
					isValidOutOfDate={DateUtils.isOutOfDate(general.valid)}
					conceptVersion={general.conceptVersion}
					handleValidation={handleClickValidation}
					handleDeletion={handleClickDeletion}
				/>
				<ErrorBloc error={serverSideError} />
				<CheckSecondLang />

				<ConceptGeneral secondLang={secondLang} attr={general} langs={langs} />
				<ConceptLinks secondLang={secondLang} links={links} />
				<ConceptNotes secondLang={secondLang} notes={notes} langs={langs} />
			</div>
			<ModalRmes
				id="validation-concept-modal"
				isOpen={modalValid}
				title="Confirmation de la validation"
				body={getModalMessage([
					{ prefLabelLg1: general.prefLabelLg1, valid: general.valid },
				])}
				modalButtons={modalButtons}
				closeCancel={handleCancelValidation}
			/>
		</>
	);
};

ConceptVisualization.propTypes = {
	id: PropTypes.string, // not available for creation
	permission: permissionOverviewPropTypes.isRequired,
	general: generalPropTypes.isRequired,
	notes: notePropTypes.isRequired,
	links: linksPropTypes.isRequired,
	validateConcept: PropTypes.func.isRequired,
	langs: PropTypes.object.isRequired,
};

export default ConceptVisualization;
