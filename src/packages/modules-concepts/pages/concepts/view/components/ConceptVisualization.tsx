import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc } from "@components/errors-bloc";
import { ModalButton, ModalRmes } from "@components/modal-rmes/modal-rmes";
import { NoteVisualization } from "@components/note-visualization";
import { PageTitleBlock } from "@components/page-title-block";

import { useTitle } from "@utils/hooks/useTitle";

import {
  ConceptGeneral,
  ConceptNotes,
  Link as ConceptLink,
} from "../../../../../model/concepts/concept";
import { buildNotes } from "../../../../utils/buildNotes";
import { getModalMessage } from "../../../../utils/getModalMessage";
import { ConceptGeneral as ConceptGeneral_ } from "./ConceptGeneral";
import { ConceptLinks } from "./ConceptLinks";
import { ConceptVisualizationControls } from "../menu";

interface ConceptVisualizationProps {
  id: string;
  links: ConceptLink[];
  notes: ConceptNotes;
  secondLang: boolean;
  serverSideError?: string;
  general: ConceptGeneral;
  validateConcept: (id: string) => void;
  deleteConcept: (id: string) => void;
}

export const ConceptVisualization = ({
  id,
  links,
  notes,
  secondLang,
  serverSideError,
  general,
  validateConcept,
  deleteConcept,
}: Readonly<ConceptVisualizationProps>) => {
  const { t } = useTranslation();
  useTitle(t("concept.title"), general?.prefLabelLg1);
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

  const modalButtons: ModalButton[] = [
    {
      label: t("common.btnCancel"),
      action: handleCancelValidation,
      style: "primary",
      disabled: false,
    },
    {
      label: t("common.btnValid"),
      action: handleConfirmValidation,
      style: "primary",
      disabled: false,
    },
  ];

  return (
    <>
      <div className="container">
        <PageTitleBlock titleLg1={general.prefLabelLg1} titleLg2={general.prefLabelLg2} />
        <ConceptVisualizationControls
          id={id}
          general={general}
          validationState={general.validationState}
          conceptVersion={Number(general.conceptVersion)}
          onValidate={handleClickValidation}
          onDelete={handleClickDeletion}
        />
        <ErrorBloc error={serverSideError} />
        <CheckSecondLang />
        <ConceptGeneral_ secondLang={secondLang} concept={general} />
        <ConceptLinks secondLang={secondLang} links={links} />
        <NoteVisualization params={buildNotes(notes)} secondLang={secondLang} />
      </div>
      <ModalRmes
        id="validation-concept-modal"
        isOpen={modalValid}
        title="Confirmation de la validation"
        body={
          getModalMessage([
            {
              prefLabelLg1: general.prefLabelLg1,
              valid: general.valid ?? "",
            },
          ]) as unknown as Node
        }
        modalButtons={modalButtons}
        closeCancel={handleCancelValidation}
      />
    </>
  );
};
