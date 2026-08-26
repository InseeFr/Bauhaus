import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PickList } from "primereact/picklist";

import { ActionToolbar } from "@components/action-toolbar";
import { PublishButton, ReturnButton } from "@components/buttons/buttons-with-icons";
import { ErrorBloc } from "@components/errors-bloc";
import { ModalButton, ModalRmes } from "@components/modal-rmes/modal-rmes";
import { PageTitle } from "@components/page-title";

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
  const [availableConcepts, setAvailableConcepts] = useState<ConceptToValidate[]>(() => concepts);
  const [conceptsToPublish, setConceptsToPublish] = useState<ConceptToValidate[]>([]);
  const [idWithValid, setIdWithValid] = useState<IdWithValid[]>([]);
  const [clientSideError, setClientSideError] = useState("");

  const publish = (toPublish: ConceptToValidate[]) =>
    handleValidateConceptList(toPublish.map(({ id }) => id));

  const handleClickValidation = () => {
    if (conceptsToPublish.length === 0) {
      setClientSideError(t("concept.validation.hasNot"));
      return;
    }
    const withValid = toIdWithValid(conceptsToPublish);
    if (withValid.length === 0) {
      publish(conceptsToPublish);
    } else {
      setIdWithValid(withValid);
    }
  };

  const handleCancelValidation = () => setIdWithValid([]);

  const handleConfirmValidation = () => {
    handleCancelValidation();
    publish(conceptsToPublish);
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
      <div className="container">
        <PageTitle title={t("concept.validation.title")} />
        <ActionToolbar>
          <ReturnButton action="/concepts" />
          <PublishButton action={handleClickValidation} />
        </ActionToolbar>
        <ErrorBloc error={clientSideError} />
        <PickList
          dataKey="id"
          source={availableConcepts}
          target={conceptsToPublish}
          onChange={(event) => {
            // PrimeReact type les deux listes en `any` : on rétablit le type au passage.
            setAvailableConcepts(event.source as ConceptToValidate[]);
            setConceptsToPublish(event.target as ConceptToValidate[]);
            setClientSideError("");
          }}
          itemTemplate={(concept: ConceptToValidate) => concept.label}
          sourceHeader={t("concept.validation.availablePanelTitle", {
            size: availableConcepts.length,
          })}
          targetHeader={t("concept.validation.panelTitle", { size: conceptsToPublish.length })}
          filter
          filterBy="label"
          sourceFilterPlaceholder={t("common.searchLabelPlaceholder")}
          targetFilterPlaceholder={t("common.searchLabelPlaceholder")}
          showSourceControls={false}
          showTargetControls={false}
          sourceStyle={{ height: "20rem" }}
          targetStyle={{ height: "20rem" }}
        />
      </div>
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
