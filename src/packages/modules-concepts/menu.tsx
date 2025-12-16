import { ExportButton, PublishButton } from "@components/buttons/buttons-with-icons";
import { MasculineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";

import { HasAccess } from "../auth/components/auth";

export const Menu = () => {
  return (
    <VerticalMenu>
      <HasAccess module="CONCEPT_CONCEPT" privilege="CREATE">
        <MasculineButton action="/concepts/create" />
      </HasAccess>
      <ExportButton action="/concepts/export" wrapper={false} />
      <HasAccess module="CONCEPT_CONCEPT" privilege="PUBLISH">
        <PublishButton action="/concepts/validation" wrapper={false} />
      </HasAccess>
    </VerticalMenu>
  );
};
