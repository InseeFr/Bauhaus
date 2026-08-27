import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PublishButton } from "@components/buttons/buttons-with-icons";
import { ModalButton, ModalRmes } from "@components/modal-rmes/modal-rmes";
import { Picker } from "@components/picker-page";

import { getModalMessage } from "../../../../utils/getModalMessage";

interface ConceptToValidate {
  id: string;
  label: string;
  valid?: string | null;
}

interface IdWithValid {
  prefLabelLg1: string;
  valid: string;
}

interface ConceptsToValidateProps {
  concepts: ConceptToValidate[];
  handleValidateConceptList: (ids: string[]) => void;
}

const toIdWithValid = (concepts: ConceptToValidate[]): IdWithValid[] =>
  concepts.reduce<IdWithValid[]>((acc, { label: prefLabelLg1, valid }) => {
    if (valid) acc.push({ prefLabelLg1, valid });
    return acc;
  }, []);

const ConceptsToValidate = ({
  concepts,
  handleValidateConceptList,
}: Readonly<ConceptsToValidateProps>) => {
  const { t } = useTranslation();
  const [idsToPublish, setIdsToPublish] = useState<string[]>([]);
  const [idWithValid, setIdWithValid] = useState<IdWithValid[]>([]);

  // Les concepts ayant une date de fin de validité demandent une confirmation :
  // une fois publiés, ils ne seront plus modifiables.
  const handleAction = (ids: string[]) => {
    const withValid = toIdWithValid(concepts.filter(({ id }) => ids.includes(id)));
    if (withValid.length === 0) {
      handleValidateConceptList(ids);
      return;
    }
    setIdsToPublish(ids);
    setIdWithValid(withValid);
  };

  const handleCancelValidation = () => setIdWithValid([]);

  const handleConfirmValidation = () => {
    handleCancelValidation();
    handleValidateConceptList(idsToPublish);
  };

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
    <div>
      <Picker
        items={concepts}
        title={t("concept.validation.title")}
        panelTitle={(size) => t("concept.validation.panelTitle", { size })}
        availablePanelTitle={(size) => t("concept.validation.availablePanelTitle", { size })}
        labelWarning={t("concept.validation.hasNot")}
        handleAction={handleAction}
        context="concepts"
        ValidationButton={({ action, disabled }) => (
          <PublishButton action={action} disabled={disabled} />
        )}
      />
      <ModalRmes
        id="validation-concept-modal"
        isOpen={idWithValid.length > 0}
        title="Confirmation de la validation"
        body={getModalMessage(idWithValid) as unknown as Node}
        modalButtons={modalButtons}
        closeCancel={handleCancelValidation}
      />
    </div>
  );
};

export default ConceptsToValidate;
