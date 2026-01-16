import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { ReturnButton, UpdateButton } from "@components/buttons/buttons-with-icons";
import { ValidationButton } from "@components/validationButton";

import { useGoBack } from "@utils/hooks/useGoBack";
import { containUnsupportedStyles } from "@utils/html-utils";

import { HasAccess } from "../../../auth/components/auth";
import D from "../../../deprecated-locales/build-dictionary";
import { Series } from "../../../model/operations/series";

interface MenuTypes {
  series: Series;
  onPublish: VoidFunction;
}
export const Menu = ({ series, onPublish }: Readonly<MenuTypes>) => {
  const goBack = useGoBack();

  /*
   * The publication button should be enabled only if RICH_TEXT value do not
   * have unsupported styles like STRIKETHROUGH, color or background color
   */
  const publicationDisabled = containUnsupportedStyles(series);
  const ableToCreateASimsForThisSeries = (series.operations || []).length === 0;

  return (
    <ActionToolbar>
      <ReturnButton action={() => goBack("/operations/series")} />

      {series.idSims && (
        <Button action={`/operations/sims/${series.idSims}`} label={D.btnSimsVisu} />
      )}
      {!series.idSims && (
        <HasAccess
          module="OPERATION_SIMS"
          privilege="CREATE"
          stamps={series.creators}
          complementaryCheck={ableToCreateASimsForThisSeries}
        >
          <Button action={`/operations/series/${series.id}/sims/create`} label={D.btnSimsCreate} />
        </HasAccess>
      )}
      <HasAccess module="OPERATION_SERIES" privilege="PUBLISH" stamps={series.creators}>
        <ValidationButton object={series} callback={onPublish} disabled={publicationDisabled} />
      </HasAccess>
      <HasAccess module="OPERATION_SERIES" privilege="UPDATE" stamps={series.creators}>
        <UpdateButton action={`/operations/series/${series.id}/modify`} />
      </HasAccess>
    </ActionToolbar>
  );
};
