import { FeminineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";

import { HasAccess } from "../../../auth/components/auth";

export const HomePageMenu = () => {
  return (
    <VerticalMenu>
      <HasAccess module="CODESLIST_CODESLIST" privilege="CREATE">
        <FeminineButton action="/codelists/create" />
      </HasAccess>
    </VerticalMenu>
  );
};
