import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";

import { ActionToolbar } from "@components/action-toolbar";
import { CloseIconButton, SaveButton } from "@components/buttons/buttons-with-icons";

import { ComponentSpecificationForm } from "./ComponentSpecificationForm";
import "./ComponentSpecificationModal.css";

export const ComponentSpecificationModalBody = ({
  specification: defaultSpecification,
  structureComponents,
  selectedComponent,
  onClose,
  onSave,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const [specification, setSpecification] = useState(defaultSpecification || {});

  return (
    <div className="modal-content">
      <div className="modal-header">
        <CloseIconButton onClick={onClose} />
        <h4 className="modal-title">{t("component.componentSpecification")}</h4>
      </div>
      <div className="modal-body">
        <ComponentSpecificationForm
          onChange={setSpecification}
          component={specification}
          selectedComponent={selectedComponent}
          structureComponents={structureComponents}
        />
      </div>
      <div className="modal-footer">
        <ActionToolbar>
          <SaveButton disabled={disabled} action={() => onSave(specification)} />
        </ActionToolbar>
      </div>
    </div>
  );
};

export const ComponentSpecificationModal = (props) => {
  return (
    <Modal
      className="Modal__Bootstrap modal-dialog structures structures-specification-modal"
      isOpen={true}
      ariaHideApp={false}
    >
      <ComponentSpecificationModalBody {...props} />
    </Modal>
  );
};
