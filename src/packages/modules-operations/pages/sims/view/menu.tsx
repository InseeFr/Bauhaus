import { ActionToolbar } from "@components/action-toolbar";
import {
  DeleteButton,
  ExportButton,
  ReturnButton,
  UpdateButton,
} from "@components/buttons/buttons-with-icons";
import { ValidationButton } from "@components/validationButton";

import { HasAccess } from "../../../../auth/components/auth";
import { Sims } from "../../../../model/Sims";
import { useGoBack } from "../../../../utils/hooks/useGoBack";
import { getParentUri } from "./utils/getParentUri";

interface MenuTypes {
  sims: Sims;
  owners: string[];
  onExport: VoidFunction;
  onDelete: VoidFunction;
  onPublish: VoidFunction;
}
export const Menu = ({ sims, owners, onExport, onDelete, onPublish }: Readonly<MenuTypes>) => {
  const goBack = useGoBack();

  return (
    <ActionToolbar>
      {/* Une SIMS est toujours rattachée à une opération, une série ou un indicateur. */}
      <ReturnButton action={() => goBack(getParentUri(sims)!)} />
      <HasAccess module="OPERATION_SIMS" privilege="DELETE" complementaryCheck={!!sims.idSeries}>
        <DeleteButton action={onDelete} />
      </HasAccess>
      <HasAccess module="OPERATION_SIMS" privilege="PUBLISH" stamps={owners}>
        <ValidationButton object={sims} callback={onPublish} disabled={false} />
      </HasAccess>
      <HasAccess module="OPERATION_SIMS" privilege="UPDATE" stamps={owners}>
        <UpdateButton action={`/operations/sims/${sims.id}/modify`} />
      </HasAccess>
      <HasAccess module="OPERATION_SIMS" privilege="READ">
        <ExportButton action={onExport} />
      </HasAccess>
    </ActionToolbar>
  );
};
