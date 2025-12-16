import { ExportButton, ImportButton } from "@components/buttons/buttons-with-icons";
import { FeminineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";

import { HasAccess } from "../../auth/components/auth";

export const DumbHomePageMenu = ({ isLocal }: Readonly<{ isLocal: boolean }>) => {
  return (
    <VerticalMenu>
      <HasAccess module="STRUCTURE_STRUCTURE" privilege="CREATE">
        <FeminineButton action="/structures/create" />
      </HasAccess>
      {isLocal && <ImportButton action="/structures/import" wrapper={false} />}
      {isLocal && <ExportButton action="/structures/export" wrapper={false} />}
    </VerticalMenu>
  );
};

export const HomePageMenu = () => {
  const isLocal = import.meta.env.VITE_API_MODE === "local";
  return <DumbHomePageMenu isLocal={isLocal} />;
};
