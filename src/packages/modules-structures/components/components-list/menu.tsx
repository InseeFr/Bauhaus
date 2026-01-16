import { MasculineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";

import { HasAccess } from "../../../auth/components/auth";

export const HomePageMenu = ({ filter }: Readonly<{ filter: string }>) => {
  return (
    <VerticalMenu>
      <HasAccess module="STRUCTURE_COMPONENT" privilege="CREATE">
        <MasculineButton
          action={"/structures/components/create?type=" + encodeURIComponent(filter)}
        />
      </HasAccess>
    </VerticalMenu>
  );
};
