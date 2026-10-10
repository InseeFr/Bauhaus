import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { SaveButton } from "@components/buttons/buttons-with-icons";
import { Dialog } from "@components/ui/dialog";

import { ComponentDefinition } from "@model/structures/Component";

import { ComponentSpecification, ComponentSpecificationForm } from "./ComponentSpecificationForm";

interface ComponentSpecificationModalTypes {
  specification?: ComponentSpecification;
  structureComponents: ComponentDefinition[];
  selectedComponent: ComponentDefinition;
  onClose: VoidFunction;
  onSave?: (specification: ComponentSpecification) => void;
  disabled?: boolean;
}

export const ComponentSpecificationModal = ({
  specification: defaultSpecification,
  structureComponents,
  selectedComponent,
  onClose,
  onSave,
  disabled = false,
}: Readonly<ComponentSpecificationModalTypes>) => {
  const { t } = useTranslation();

  const [specification, setSpecification] = useState<ComponentSpecification>(
    defaultSpecification || {},
  );

  return (
    <Dialog
      className="structures"
      visible={true}
      onHide={onClose}
      header={t("component.componentSpecification")}
      style={{ width: "50rem", maxWidth: "95vw" }}
      // Sans cela, le scroll du fond décroche les listes déroulantes du formulaire.
      blockScroll
      footer={
        <ActionToolbar>
          <SaveButton disabled={disabled} action={() => onSave?.(specification)} />
        </ActionToolbar>
      }
    >
      <ComponentSpecificationForm
        onChange={setSpecification}
        component={specification}
        selectedComponent={selectedComponent}
        structureComponents={structureComponents}
      />
    </Dialog>
  );
};
