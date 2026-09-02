import { AddButton } from "@components/buttons/add";

import { Codelist } from "@model/Codelist";

import { HasAccess } from "../../auth/components/auth";

interface CodesPanelAddButtonTypes {
  codelist: Codelist;
  onHandlePanel: VoidFunction;
}

export const CodesPanelAddButton = ({
  codelist,
  onHandlePanel,
}: Readonly<CodesPanelAddButtonTypes>) => {
  if (!codelist.lastCodeUriSegment) {
    return null;
  }

  return (
    <HasAccess module="CODESLIST_CODESLIST" privilege="CREATE" stamps={[codelist?.contributor]}>
      <AddButton id="add-code" onClick={onHandlePanel} />
    </HasAccess>
  );
};
