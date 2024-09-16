import { useState, useCallback } from 'react';
import ConceptVisualizationControls from './controls';
import ConceptGeneral from './general';
import ConceptLinks from './links';
import D from '../../deprecated-locales';
import {
	ErrorBloc,
	PageTitleBlock,
	CheckSecondLang,
	ModalRmes,
	NoteVisualization,
} from '../../components';
import { useTitle } from '../../utils/hooks/useTitle';
import { isOutOfDate } from '../../utils/date-utils';
import { getModalMessage } from '../../modules-concepts/utils/build-validation-message';
import { buildNotes } from '../../modules-concepts/utils/notes';

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
	useTitle(D.conceptsTitle, general?.prefLabelLg1);
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
					isValidOutOfDate={isOutOfDate(general.valid)}
					conceptVersion={general.conceptVersion}
					handleValidation={handleClickValidation}
					handleDeletion={handleClickDeletion}
				/>
				{serverSideError && <ErrorBloc error={serverSideError} D={D} />}
				<CheckSecondLang />

				<ConceptGeneral secondLang={secondLang} attr={general} langs={langs} />
				<ConceptLinks secondLang={secondLang} links={links} />
				<NoteVisualization params={buildNotes(notes)} secondLang={secondLang} />
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

export default ConceptVisualization;
