import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton, SaveButton, UpdateButton } from "@components/buttons/buttons-with-icons";

import { Codelist } from "@model/Codelist";

import { HasAccess } from "../../auth/components/auth";

interface CodeSlidingPanelMenuTypes {
  codelist: Codelist;
  handleSubmit: VoidFunction;
  handleBack: VoidFunction;
  creation: boolean;
}

export const CodeSlidingPanelMenu = ({
  codelist,
  handleSubmit,
  handleBack,
  creation,
}: Readonly<CodeSlidingPanelMenuTypes>) => {
  const contributors = [codelist?.contributor ?? []].flat();

  return (
    <ActionToolbar>
      <ReturnButton action={handleBack} />
      <>
        {!creation && (
          <HasAccess module="CODESLIST_CODESLIST" privilege="UPDATE" stamps={contributors}>
            <UpdateButton action={handleSubmit} />
          </HasAccess>
        )}
        {creation && (
          <HasAccess module="CODESLIST_CODESLIST" privilege="CREATE" stamps={contributors}>
            <SaveButton action={handleSubmit} />
          </HasAccess>
        )}
      </>
    </ActionToolbar>
  );
};
