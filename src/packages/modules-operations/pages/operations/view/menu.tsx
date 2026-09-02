import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { ReturnButton, UpdateButton } from "@components/buttons/buttons-with-icons";
import { ValidationButton } from "@components/validationButton";

import { Operation } from "@model/Operation";

import { useGoBack } from "@utils/hooks/useGoBack";

import { HasAccess } from "../../../../auth/components/auth";

interface MenuTypes {
  operation: Operation;
  onPublish: VoidFunction;
}

export const Menu = ({ operation, onPublish }: Readonly<MenuTypes>) => {
  const goBack = useGoBack();

  const { t } = useTranslation();

  return (
    <ActionToolbar>
      <ReturnButton action={() => goBack("/operations/operations")} />
      {operation.idSims && (
        <Button action={`/operations/sims/${operation.idSims}`} label={t("sims.btnSimsVisu")} />
      )}
      {!operation.idSims && (
        <HasAccess module="OPERATION_SIMS" privilege="CREATE" stamps={operation.series.creators}>
          <Button
            action={`/operations/operation/${operation.id}/sims/create`}
            label={t("sims.btnSimsCreate")}
          />
        </HasAccess>
      )}
      <HasAccess
        module="OPERATION_OPERATION"
        privilege="PUBLISH"
        stamps={operation.series.creators}
      >
        <ValidationButton object={operation} callback={onPublish} disabled={false} />
      </HasAccess>
      <HasAccess module="OPERATION_OPERATION" privilege="UPDATE" stamps={operation.series.creators}>
        <UpdateButton action={`/operations/operation/${operation.id}/modify`} />
      </HasAccess>
    </ActionToolbar>
  );
};
