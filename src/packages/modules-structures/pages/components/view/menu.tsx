import { ActionToolbar } from "@components/action-toolbar";
import { DeleteButton, ReturnButton, UpdateButton } from "@components/buttons/buttons-with-icons";
import { ValidationButton } from "@components/validationButton";

import { Component } from "@model/structures/Component";
import { UNPUBLISHED } from "@model/ValidationState";

import { HasAccess } from "../../../../auth/components/auth";

const canBeDeleted = (component: Component) => {
  const withoutStructuresUsingThisComponent =
    !component.structures || component.structures?.length === 0;
  return withoutStructuresUsingThisComponent;
};

interface ViewMenuTypes {
  component: Component;
  // `AbstractButton`'s `action` prop (used by `UpdateButton`/`DeleteButton`) accepts either a
  // route to navigate to or a callback; `handleUpdate` is a route string when editing navigates
  // to a dedicated page (see the mutualized component view).
  handleUpdate: VoidFunction | string;
  publish: VoidFunction;
  isPublishing?: boolean;
  handleDelete: VoidFunction;
  isDeleting?: boolean;
  handleBack: VoidFunction;
  updatable: boolean;
}

export const ViewMenu = ({
  component,
  handleUpdate,
  publish,
  isPublishing = false,
  handleDelete,
  isDeleting = false,
  handleBack,
  updatable,
}: Readonly<ViewMenuTypes>) => {
  return (
    <ActionToolbar>
      <ReturnButton action={handleBack} />
      <HasAccess module="STRUCTURE_COMPONENT" privilege="PUBLISH" stamps={component?.contributor}>
        <ValidationButton callback={publish} object={component} disabled={isPublishing} />
      </HasAccess>
      {canBeDeleted(component) && (
        <HasAccess
          module="STRUCTURE_COMPONENT"
          privilege="DELETE"
          stamps={component?.contributor}
          complementaryCheck={component.validationState === UNPUBLISHED}
        >
          <DeleteButton action={handleDelete} disabled={isDeleting} />
        </HasAccess>
      )}
      {updatable && (
        <HasAccess module="STRUCTURE_COMPONENT" privilege="UPDATE" stamps={component?.contributor}>
          <UpdateButton action={handleUpdate} />
        </HasAccess>
      )}
    </ActionToolbar>
  );
};
