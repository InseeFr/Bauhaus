import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { ReturnButton, UpdateButton } from "@components/buttons/buttons-with-icons";
import { ValidationButton } from "@components/validationButton";

import { useGoBack } from "@utils/hooks/useGoBack";
import { containUnsupportedStyles } from "@utils/html-utils";

import { HasAccess } from "../../../auth/components/auth";
import D from "../../../deprecated-locales/build-dictionary";
import { Indicator } from "../../../model/operations/indicator";

interface MenuTypes {
  indicator: Indicator;
  publish: VoidFunction;
}

export const Menu = ({ indicator, publish }: Readonly<MenuTypes>) => {
  const goBack = useGoBack();

  /*
   * The publication button should be enabled only if RICH_TEXT value do not
   * have unsupported styles like STRIKETHROUGH, color or background color
   */
  const publicationDisabled = containUnsupportedStyles(indicator);

  return (
    <ActionToolbar>
      <ReturnButton action={() => goBack("/operations/indicators")} />
      {indicator.idSims && (
        <Button action={`/operations/sims/${indicator.idSims}`} label={D.btnSimsVisu} />
      )}
      {!indicator.idSims && (
        <HasAccess module="OPERATION_SIMS" privilege="CREATE" stamps={indicator.creators}>
          <Button
            action={`/operations/indicator/${indicator.id}/sims/create`}
            label={D.btnSimsCreate}
          />
        </HasAccess>
      )}
      <HasAccess module="OPERATION_INDICATOR" privilege="PUBLISH" stamps={indicator.creators}>
        <ValidationButton object={indicator} callback={publish} disabled={publicationDisabled} />
      </HasAccess>
      <HasAccess module="OPERATION_INDICATOR" privilege="UPDATE" stamps={indicator.creators}>
        <UpdateButton action={`/operations/indicator/${indicator.id}/modify`} />
      </HasAccess>
    </ActionToolbar>
  );
};
